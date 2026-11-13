import { createAgent } from "@ui-sdk/react/agent"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { App } from "./App"

function combobox() {
  return screen.getByRole<HTMLInputElement>("combobox", { name: "City" })
}

function activeOption() {
  const input = combobox()
  const id = input.getAttribute("aria-activedescendant")
  expect(id, "aria-activedescendant").toBeTruthy()
  const option = document.getElementById(id!)
  expect(option, "active option").toBeTruthy()
  expect(option!.getAttribute("role")).toBe("option")
  expect(option!.hasAttribute("data-highlighted")).toBe(true)
  return option!
}

test("arrows, enter, and escape move through the list", async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = combobox()

  expect(input.getAttribute("role")).toBe("combobox")
  expect(input.getAttribute("aria-autocomplete")).toBe("list")
  expect(input.getAttribute("aria-expanded")).toBe("false")
  expect(screen.getByRole("button", { name: "Show cities" })).toBeTruthy()

  await user.click(input)

  expect(input.getAttribute("aria-expanded")).toBe("true")
  expect(document.activeElement).toBe(input)
  const listId = input.getAttribute("aria-controls")
  const list = listId ? document.getElementById(listId) : null
  expect(list?.getAttribute("role")).toBe("listbox")
  expect(list?.getAttribute("aria-labelledby")).toBe(
    input.getAttribute("aria-labelledby"),
  )

  const first = activeOption()
  expect(first.textContent).toContain("Praha")

  await user.keyboard("{ArrowDown}")
  const second = activeOption()
  expect(second.textContent).toContain("Brno")
  expect(second.id).not.toBe(first.id)

  await user.keyboard("{ArrowUp}")
  expect(activeOption().textContent).toContain("Praha")

  await user.keyboard("{ArrowDown}{Enter}")
  expect(input.value).toBe("Brno")
  expect(input.getAttribute("aria-expanded")).toBe("false")
  expect(screen.getByRole("region", { name: "Selected" }).textContent).toContain(
    "Brno",
  )

  await user.keyboard("{ArrowDown}")
  expect(input.getAttribute("aria-expanded")).toBe("true")
  await user.keyboard("{Escape}")
  expect(input.getAttribute("aria-expanded")).toBe("false")
  expect(document.activeElement).toBe(input)
  expect(input.value).toBe("Brno")
})

test("home and end move the caret while the list stays open", async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = combobox()

  await user.click(input)
  await user.keyboard("brn")
  expect(input.getAttribute("aria-expanded")).toBe("true")
  expect(input.selectionStart).toBe(3)

  await user.keyboard("{Home}")
  expect(input.getAttribute("aria-expanded")).toBe("true")
  expect(document.activeElement).toBe(input)
  expect(input.selectionStart).toBe(0)
  expect(activeOption().textContent).toContain("Brno")

  await user.keyboard("{End}")
  expect(input.selectionStart).toBe(input.value.length)
  expect(input.value).toBe("brn")
})

test("typing filters the cities and shows an empty state", async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = combobox()

  await user.click(input)
  await user.keyboard("ceske")

  expect(screen.getByRole("option", { name: /České Budějovice/ })).toBeTruthy()
  expect(screen.queryByRole("option", { name: /Praha/ })).toBeNull()
  expect(screen.queryByRole("option", { name: /Česká Lípa/ })).toBeNull()

  await user.keyboard("{Enter}")
  expect(input.value).toBe("České Budějovice")

  await user.clear(input)
  await user.keyboard("carlsbad")
  expect(screen.getByRole("option", { name: /Karlovy Vary/ })).toBeTruthy()
  expect(screen.queryByRole("option", { name: /Praha/ })).toBeNull()

  await user.clear(input)
  await user.keyboard("zzzz")
  expect(screen.queryByRole("option")).toBeNull()
  expect(screen.getByText("No cities match that search.")).toBeTruthy()
})

test("an agent can find the city field and choose Brno", async () => {
  const agent = createAgent()
  render(<App />)

  const components = agent
    .snapshot()
    .filter((entry) => !entry.offPage && entry.component !== "more")
  for (const entry of components) {
    expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy()
  }
  expect(components.map((entry) => entry.label)).toContain("City")

  const found = await agent.query({ within: "City", text: "Brno" })
  expect(Array.isArray(found), JSON.stringify(found)).toBe(true)
  if (!Array.isArray(found)) return
  const brno = found[0]?.items?.find((item) => item.label === "Brno")
  expect(brno?.value).toBeTruthy()

  const result = await agent.act({
    steps: [{ ref: "City", action: "setValue", args: [brno!.value] }],
  })
  expect(result.ok, result.error?.message).toBe(true)
  expect(combobox().value).toBe("Brno")
  expect(
    screen.getByRole("region", { name: "Selected" }).textContent,
  ).toContain("South Moravian")
})
