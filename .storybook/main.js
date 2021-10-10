module.exports = {
  "stories": [
    "../src/client/**/*.stories.mdx",
    "../src/client/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "core": {
    "builder": "webpack5"
  }
}