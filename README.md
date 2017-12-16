# Purpose

`jsonschema-loader` is a webpack loader used to convert json schema to
typescript class which can then be used in your typescript file directly.

# Install

```bash
npm install --save-dev jsonschema-loader
```

# Usage

First, declare your schema to typescript. Create a file called
`declaration.d.ts` at the root of your project and add the following declaration
(we assume your schema extensions are `.schema.json`):
```typescript
declare module '*.schema.json' {
  const schema: string;
  export default schema;
}
```

Then tell webpack to use jsonschema-loader. In your webpack config, add the
following rule:
```javascript
{
  test: /\.schema\.json$/,
  loader: 'ts-loader!jsonschema-loader',
  exclude: /(node_modules)/,
}
```
We use `ts-loader` here but we could use any webpack typescript loader.
> Note that loaders are piped from **right to left**.

Then, in your source:
```typescript
import Person from './schema/person.schema.json';
```

with `person.schema.json` containing a valid json schema:
```json
{
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["firstName", "lastName"]
}
```
