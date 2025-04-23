// export default {
//   plugins: {
//     '@tailwindcss/postcss7-compat': {},
//     autoprefixer: {},
//   },
// }

import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};





