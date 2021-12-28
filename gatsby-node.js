// graphql function doesn't throw an error so we have to check to check for the result.errors to throw manually
const wrapper = promise => promise.then((result) => {
  if (result.errors) throw result.errors;
  return result;
});


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const pages = await wrapper(
    graphql(`
      {
        allPrismicFrequentlyAskedQuestions {
          edges {
            node {
              id
              uid
            }
          }
        }
        allPrismicLegal {
          edges {
            node {
              id
              uid
            }
          }
        }
      }
    `),
  );

  const faqPageTemplate = require.resolve('./src/templates/faq.js');
  const legalPageTemplate = require.resolve('./src/templates/legal.js');

  /* ---------------------------------------------
  = Create an individual page for each Information page =
  ----------------------------------------------- */
  const faqPageList = pages.data.allPrismicFrequentlyAskedQuestions.edges;
  faqPageList.forEach((edge) => {
    // The uid you assigned in Prismic is the slug!
    createPage({
      path: `/${edge.node.uid}/`,
      component: faqPageTemplate,
      context: {
        // Pass the unique ID (uid) through context so the template can filter by it
        uid: edge.node.uid,
      },
    });
  });

  const legalPageList = pages.data.allPrismicLegal.edges;
  legalPageList.forEach((edge) => {
    // The uid you assigned in Prismic is the slug!
    createPage({
      path: `/${edge.node.uid}/`,
      component: legalPageTemplate,
      context: {
        // Pass the unique ID (uid) through context so the template can filter by it
        uid: edge.node.uid,
      },
    });
  });
};
