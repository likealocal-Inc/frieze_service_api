export const ElseUtils = {
  makeAuthEmail: (to, url, userId) => {
    return {
      to: to,
      subject: 'Prieze Taxi User Auth Mail',
      html: `<a href='${url}?${userId}'>authLink</a>`,
    };
  },
  makeAuthEmail2: (to, html) => {
    return {
      to: to,
      subject: 'Prieze Taxi User Auth Mail',
      html: html,
    };
  },
};
