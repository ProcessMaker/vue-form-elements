const Validator = require('validatorjs');

//register custom date rule
Validator.register('after', function(date, params) {
    const inputDate = new Date(date);
    const afterDate = new Date(params);
    
    return inputDate.toISOString() > afterDate.toISOString();
}, 'The :attribute must be after :after.');

Validator.register('after_or_equal', function(date, params) {
    const inputDate = new Date(date);
    const equalOrAfterDate = new Date(params);
    
    return inputDate.toISOString() >= equalOrAfterDate.toISOString();
}, 'The :attribute must be equal or after :after_or_equal.');

Validator.register('before', function(date, params) {
    const inputDate = new Date(date);
    const beforeDate = new Date(params);
    
    return inputDate.toISOString() < beforeDate.toISOString();
}, 'The :attribute must be before :before.');

Validator.register('before_or_equal', function(date, params) {
    const inputDate = new Date(date);
    const beforeDate = new Date(params);
    
    return inputDate.toISOString() <= beforeDate.toISOString();
}, 'The :attribute must be equal or after :before_or_equal.');