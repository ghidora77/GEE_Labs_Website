// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Manually defining the sidebar to include files and categorize folders
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
    },
    {
      type: 'doc',
      id: 'attribution',
    },
    {
      type: 'category',
      label: 'Appendix',
      items: [
        {
          type: 'autogenerated',
          dirName: 'Appendix', // assuming 'Appendix' folder exists in your docs directory
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        {
          type: 'autogenerated',
          dirName: 'Tutorials', // assuming 'Tutorials' folder exists in your docs directory
        },
      ],
    },
  ],
};

export default sidebars;
