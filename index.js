const Handlebars = require('handlebars');
const merge = require('deepmerge');

const GUIDELINES = require('./guidelines');

const SUPPORTED = 1;
const NOT_SUPPORTED = 0;
const NOT_APPLICABLE = -1;
const SUPPORTED_WITH_EXCEPTIONS = 2;

const constants = {
  SUPPORTED,
  NOT_SUPPORTED,
  NOT_APPLICABLE,
  SUPPORTED_WITH_EXCEPTIONS,
  GUIDELINES,
};

const templates = {
  page:
    '<!doctype html><head><title>{{title}}</title></head><body>{{> guidelines}}</body></html>',
  guidelines:
    '{{> style colors}} {{#each sections as |s|}} {{> section s}} {{/each}}',
  section:
    '<table class="vpat"><tr><td colspan="3">{{{title}}}</td></tr>{{#each guidelines as |g|}} {{> guideline g}} {{/each}}</table>',
  guideline:
    '<tr><td>{{> cell description}}</td><td>{{> cell support}}</td><td>{{> cell notes}}</td></tr>',
  style: `<style>
		table.vpat{
			font-family: sans-serif;
			min-width: 640px;
		  border: 1px {{border}} solid;
		  margin-top: 16px;
	    border-spacing: 0;
	    border-collapse: collapse;
		}
		table.vpat td {
	    padding: 8px;
    	border: 1px {{border}} solid;
		}
		table.vpat tr:nth-child(2n + 1) { background: {{zebra1}}; }
		table.vpat tr:nth-child(2n) { background: {{zebra2}}; }
		table.vpat tr td:nth-child(1) { width: 45% }
		table.vpat tr td:nth-child(2) { width: 20% }
		table.vpat tr td:nth-child(3) { width: 35% }
		table.vpat .vpat-supported { color: {{supported}}; }
		table.vpat .vpat-not-supported { color: {{notSupported}}; }
		table.vpat .vpat-not-applicable { color: {{notApplicable}}; }
		table.vpat .vpat-supported-with-exceptions { color: {{exceptions}}; }
	</style>`,
  cell: '<span class="{{className}}">{{{text}}}</span>',
};

const colors = {
  supported: '#27ae60',
  notSupported: '#e74c3c',
  exceptions: '#d35400',
  notApplicable: '#7f8c8d',
  zebra1: '#fff',
  zebra2: '#ecf0f1',
  border: '#7f8c8d',
};

const defaults = {
  page: true,
  colors,
  templates,
  defaultSupport: NOT_SUPPORTED,
};

module.exports = function(support = {}, options = {}) {
  options = merge(defaults, options);
  Object.keys(options.templates).forEach(key => {
    Handlebars.registerPartial(key, options.templates[key]);
  });

  const data = {
    sections: [],
    title: 'VPAT',
    colors: options.colors,
  };

  function getSupport(support = {}) {
    let result = {};
    let s = support;
    if (typeof support === 'object') {
      s = support.supported;
      Object.assign(result, support || {});
    }
    switch (true) {
      case s === SUPPORTED:
      case typeof s === 'string' && s.toLowerCase() === 'supported':
      case s === true:
        result.text = 'Supports';
        result.className = 'vpat-supported';
        break;
      case s === SUPPORTED_WITH_EXCEPTIONS:
      case s === '':
      case typeof s === 'string' && s.toLowerCase() === 'partial':
      case typeof s === 'string' && s.toLowerCase() === 'exceptions':
        result.text = 'Supports with Exceptions';
        result.className = 'vpat-supported-with-exceptions';
        break;
      case s === NOT_APPLICABLE:
      case typeof s === 'string' && s.toLowerCase() === 'not applicable':
      case typeof s === 'string' && s.toLowerCase() === 'notapplicable':
      case typeof s === 'string' && s.toLowerCase() === 'not_applicable':
      case s === -1:
      case Number.isNaN(s):
        result.text = 'Not Applicable';
        result.className = 'vpat-not-applicable';
        break;
      case s === NOT_SUPPORTED:
      case typeof s === 'string' && s.toLowerCase() === 'not supported':
      case typeof s === 'string' && s.toLowerCase() === 'notsupported':
      case typeof s === 'string' && s.toLowerCase() === 'not_supported':
      case typeof s === 'undefined':
      case typeof s === null:
        result.text = 'Not Supported';
        result.className = 'vpat-not-supported';
        break;
      case typeof s === 'string':
        result.text = s;
        break;
    }
    return result;
  }
  GUIDELINES.sections.forEach(sec => {
    const section = {
      title: `<strong>${sec.id}</strong> ${sec.title}`,
      guidelines: [],
    };
    data.sections.push(section);

    const thisSupport = support[sec.id] || options.defaultSupport;
    const sectionSupport = getSupport(thisSupport);
    function addGuidelineRow(subsection, label, id, parentSupport) {
      const thisSupport = support[`${id}-${subsection.id}`] || parentSupport;
      const subsectionSupport = getSupport(thisSupport);
      if (subsection.description) {
        const guideline = {
          description: {
            text: `<strong>${label} (${subsection.id})</strong> ${
              subsection.description
            }`,
            className: '',
          },
          support: subsectionSupport,
          notes: {
            text: subsectionSupport.notes || '',
          },
        };
        section.guidelines.push(guideline);
      }
      if (subsection.subsections) {
        subsection.subsections.forEach(s => {
          addGuidelineRow(
            s,
            `${label}(${subsection.id}) `,
            `${id}-${subsection.id}`,
            thisSupport
          );
        });
      }
    }
    sec.subsections.forEach(s => {
      addGuidelineRow(s, '', sec.id, thisSupport);
    });
  });
  const template = options.page ? templates.page : templates.guidelines;
  const render = Handlebars.compile(template);
  const html = render(data);
  return html;
};
Object.assign(module.exports, constants);
