import { CityCombobox } from "./CityCombobox"

function App() {
  return (
    <main className="page">
      <article className="card">
        <p className="eyebrow">UI SDK beta</p>
        <h1>Czech cities</h1>
        <p className="lede">
          A searchable select for 32 Czech cities. Type to filter, move with
          the arrow keys, and press Enter to choose. Focus stays in the field.
        </p>
        <CityCombobox />
        <ul className="keys">
          <li>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </li>
          <li>
            <kbd>Home</kbd>
            <kbd>End</kbd> text cursor
          </li>
          <li>
            <kbd>Enter</kbd> choose
          </li>
          <li>
            <kbd>Esc</kbd> close
          </li>
        </ul>
        <p className="credit">
          Built with{" "}
          <a href="https://ui-sdk.dev/docs/react/components/combobox">
            @ui-sdk/react/combobox
          </a>{" "}
          and{" "}
          <a href="https://github.com/vercel-labs/ui">@ui-sdk/core</a>{" "}
          0.1.0-beta.1. The packages are in beta and the API can change.
        </p>
      </article>
    </main>
  )
}

export { App }
