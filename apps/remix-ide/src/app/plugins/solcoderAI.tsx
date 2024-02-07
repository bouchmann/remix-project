import { Plugin } from '@remixproject/engine'

const _paq = (window._paq = window._paq || [])

const profile = {
  name: 'solcoder',
  displayName: 'solcoder',
  description: 'solcoder',
  methods: ['code_generation', 'code_completion'],
  events: [],
  maintainedBy: 'Remix',
}

export class SolCoder extends Plugin {
  constructor() {
    super(profile)
  }

  async code_generation(prompt): Promise<any> {
    this.call('layout', 'maximizeTerminal')
    this.call('terminal', 'log', 'Waiting for Solcoder answer...')
    let result
    try {
      result = await(
            await fetch("https://hkfll35zthu6e2-7861.proxy.runpod.net/api/code_generation", {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"data":[prompt,false,1000,0.2,0.8,50]}),
          })
        ).json()
    } catch (e) {
      this.call('terminal', 'log', { type: 'typewritererror', value: `Unable to get a response ${e.message}` })
      return
    }
    if (result) {
      this.call('terminal', 'log', { type: 'typewriterwarning', value: result.data[0]})
    } else if  (result.error) {
      this.call('terminal', 'log', { type: 'typewriterwarning', value: "Error on request" })
    }

  }


  async code_completion(prompt): Promise<any> {
    let result
    try {
      result = await(
            await fetch("https://hkfll35zthu6e2-7861.proxy.runpod.net/api/code_completion", {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"data":[
              prompt, // string  in 'context_code' Textbox component	
              "", // string  in 'comment' Textbox component		
              false, // boolean  in 'stream_result' Checkbox component		
              200, // number (numeric value between 0 and 2000) in 'max_new_tokens' Slider component		
              0.4, // number (numeric value between 0.01 and 1) in 'temperature' Slider component		
              0.90, // number (numeric value between 0 and 1) in 'top_p' Slider component		
              50, // number (numeric value between 1 and 200) in 'top_k' Slider component
        ]}),
          })
        ).json()

      console.log('solcoder result', result.data)
      return result.data
    } catch (e) {
      this.call('terminal', 'log', { type: 'typewritererror', value: `Unable to get a response ${e.message}` })
      return
    }
  }

}
