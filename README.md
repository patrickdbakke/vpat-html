# VPAT-HTML

VPAT-HTML is a tool for generating Voluntary Product Accessibility Template html tables from json 🏗ℹ

# Usage

```
const VPAT = require('vpat-html');
const support = {
  // ...
}
const html = new VPAT(support);
```

# Features
```
  // define support for a given guideline:
  '1194.21-a': true,
  '1194.21-a': {
    supported: true,
  },
  '1194.21-a': {},
  '1194.21-a': VPAT.SUPPORTED,

  // define lack of support for a given guideline:
  '1194.21-a': null,
  '1194.21-a': undefined,
  '1194.21-a': false,
  '1194.21-a': {
    supported: false,
  },
  '1194.21-a': VPAT.NOT_SUPPORTED,

  // define n/a for a given guideline: 
  '1194.21-a': NaN,
  '1194.21-a': {
    supported: -1,
  },
  '1194.21-': {
    supported: NaN,
  },
  '1194.21-a': VPAT.NOT_APPLICABLE,

  // define partial support for a given guideline: 
  '1194.21-a': '',
  '1194.21-a': {
    supported: '',
  },
  '1194.21-a': 'partial',
  '1194.21-a': {
    supported: 'partial',
  },
  '1194.21-a': 'exceptions',
  '1194.21-a': {
    supported: 'exceptions',
  },
  '1194.21-a': VPAT.SUPPORTED_WITH_EXCEPTIONS,

  // define your own text for a given guideline: 
  '1194.21-a': {
    supported: VPAT.SUPPORTED_WITH_EXCEPTIONS,
    text: 'Supports with exceptions: some additional text'
  },

  // define remarks or explanations for a given feature: 
  '1194.21-a': {
    notes: '<ul><li>Drag-and-drop operations are not accessible to keyboard-only users</li></ul>',
  },

  /////////////////////////

  // define support for a section 
  '1194.21': {
    supports: true,
  },
  
  // define support for a sub-section 
  '1194.21-a': {
    supports: true,
  },

  // define support for a sub-sub-section 
  '1194.23-j-1': {
    supports: true,
  },
}
```

# Additional Configuration

```
const support = {
  '1194.21': {
    supported: 'n/a',
  },
}
const options = {
  colors: {
    supported: '#27ae60',
    notSupported: '#e74c3c',
    exceptions: '#d35400',
    notApplicable: '#7f8c8d',
    zebra1: '#fff', 
    zebra2: '#ecf0f1',
    border: '#7f8c8d',
  },
}
```


# Default Support

By default, `vpat-html` assumes "Not Applicable" for non-defined features. 
If you want to change this default, 
```
const support = {
  '1194.21': {
    supported: 'n/a',
  },
}
const options: {
  defaultSupport: VPAT.SUPPORTED,
}
const html = new VPAT(support, options);

```

# Custom HTML

Templates can be modifed. Templates are implemented with [handlebars](https://www.npmjs.com/package/handlebars). 
```
# custom row template
const options = {
  templates: {
    row: '<tr><td>Section</td><td>{{description}}</td><td>{{support}}</td><td>{{notes}}</td></tr>',
  },
};
const html = new VPAT(support, options);

```

