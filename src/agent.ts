import { createAgent, registerTools } from "@ui-sdk/react/agent"

const agent = createAgent({
  allow: () => true,
})

function connectAgent() {
  return registerTools(agent, { allow: () => true })
}

export { agent, connectAgent }
