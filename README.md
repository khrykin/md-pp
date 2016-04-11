# Simple markdown preprocessor

## Usage
 - Instal package via `$ npm install -g md-pp`.
 - Create `variables.js` next to your markdown file:
  ```javascript
    module.exports = {
      height: "300 ft"
    }
  ```
 - Reference variable in markdown:

  ```
  # Hello
  The building is ${height} high
  ```

- Run once, or continuously watch for changes:

 `$ md-pp test.md --watch`

- Check the newly created `out` folder with processed markdown:

  ```
  # Hello
  The building is 300 ft high
  ```
