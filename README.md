# Toyland 
In the 2000s, my first computer became a window into a universe of knowledge, thanks to the iconic educational software Encarta and the adventures of Z Multimedia. The hours I spent exploring these programs shaped my career and sparked a curiosity in me that now drives my desire to create.

Today, with Juguetelandia, I want to share a tribute to the passion for discovery. It’s not just a project; it’s an invitation to explore and learn about the toys that defined generations.

My hope is for technology to enrich our knowledge, not overshadow it. In times when critical thinking is scarce, and shallow entertainment prevails, Juguetelandia is a space for inspiration and curiosity. Because what we truly need today is more content that encourages us to seek and learn. And if I can’t find it, why not create it myself?

## Explore the islands
[https://zulma-castaneda.github.io/toyland/](https://zulma-castaneda.github.io/toyland/)

[Visit the expo at Casatinta](https://exposiciones.casatinta.com/zulma-castaneda/)

## Screenshots
![image](https://github.com/user-attachments/assets/9585137d-2d98-420d-a611-e5cb9da0d238)

![image](https://github.com/user-attachments/assets/09ecaa64-f9e1-4367-b8d6-bdaa5f1471f0)

https://github.com/user-attachments/assets/d8f217eb-0b1c-4bf5-9a9a-7d755c7c533f

https://github.com/user-attachments/assets/42167a34-1613-481d-809c-103c616c888a


# How to run 
Simply clone the repository and run ```npm run dev```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
