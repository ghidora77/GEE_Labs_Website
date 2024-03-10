// remarkRehypePlugin.js
async function getRemarkRehypePlugins() {
  const remarkMath = (await import('remark-math')).default;
  const rehypeKatex = (await import('rehype-katex')).default;

  return {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  };
}

module.exports = function (context, options) {
  return {
    name: 'docusaurus-remark-rehype-plugin',
    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      const plugins = await getRemarkRehypePlugins();
      setGlobalData(plugins);
    },
  };
};

