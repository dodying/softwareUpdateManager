'use strict';

const data = {
  version: ['.prog_info_spec_data_row:contains("Version")', 'text', /Version:(.*)/],
  changelog: '#changelog>div>p+ul',
  download: async (res, $, fns, choice) => 'http://www.pazera-software.com/files/' + $('.jp-download-link>a').attr('href').match(/&f=(.*)/)[1]
};
module.exports = data;
