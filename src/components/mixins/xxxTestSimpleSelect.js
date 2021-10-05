let assert = require('assert');

export default {
    methods: {
        xxxtests() {
            //estos mixins funcionan si sse aumentan (como mixin) a multiselectview
            //this.testConvertForEmit();
            // this.testToMultiSelecDefault();
            //this.testToMultiSelectFormat();

            //para estos hay que poner el mixin en FormSelectList
            this.testTransformOptions();
        },

        testTransformOptions() {
            console.log('testTransformOptions iniciando...');
            const listStr = '{ "response": { "data": [ { "id": 1, "data": { "Codigo": "1", "Nombre": "Perro", "Especie": "Canis Familiaris" } }, { "id": 2, "data": { "Codigo": "2", "Nombre": "Gato", "Especie": "Catus" } }, { "id": 3, "data": { "Codigo": "3", "Nombre": "Conejo", "Especie": "Lepus" } } ] } }';
            const list = JSON.parse(listStr);

            const resObj = this.transformOptions(list.response.data, '{{data.Codigo}}', '{{data.Nombre}}', 'object');
            assert.strictEqual(3, resObj.length);
            assert.strictEqual(JSON.stringify(list.response.data[0].data), JSON.stringify(resObj[0]));
            assert.strictEqual(JSON.stringify(list.response.data[2].data), JSON.stringify(resObj[2]));

            const resObjNoMustache = this.transformOptions(list.response.data, 'data.Codigo', 'data.Nombre', 'object');
            assert.strictEqual(3, resObjNoMustache.length);
            assert.strictEqual(JSON.stringify(list.response.data[0].data), JSON.stringify(resObjNoMustache[0]));
            assert.strictEqual(JSON.stringify(list.response.data[2].data), JSON.stringify(resObjNoMustache[2]));

            const resSing = this.transformOptions(list.response.data, '{{data.Codigo}}', '{{data.Nombre}}', 'single');
            assert.strictEqual(3, resSing.length);
            assert.strictEqual(JSON.stringify(list.response.data[0].Codigo), JSON.stringify(resSing[0].Codigo));
            assert.strictEqual(JSON.stringify(list.response.data[0].Nombre), JSON.stringify(resSing[0].Nombre));

            const resSingNoMustache = this.transformOptions(list.response.data, 'data.Codigo', 'data.Nombre', 'Codigo', 'Nombre', 'single');
            assert.strictEqual(3, resSingNoMustache.length);
            assert.strictEqual(JSON.stringify(list.response.data[0].data.Codigo), JSON.stringify(resSingNoMustache[0].Codigo));
            assert.strictEqual(JSON.stringify(list.response.data[0].data.Nombre), JSON.stringify(resSingNoMustache[0].Nombre));



            //const resultEscalar = this.transformOptions(list.response.data, '{{data.Codigo}}', '{{data.Nombre}}', 'single');
            console.log('testTransformOptions terminado...');
        },

        testToMultiSelectFormat() {
            const optionsList =  [{key:1, label:"one"}, {key:2, label:"two"}];
            const obj =  {key:2, label:"two"};
            const objNotExist =  {key:2, label:"two"};
            const anyObj =  {other:2, othername:"two"};

            const testCases = [
                // with nul
                {expected:null, value:null, keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:null, value:null, keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:null, value:null, keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:null, value:null, keyField:'key', options:optionsList, asArray:false, asObject:false, },
                // with undefined
                {expected:null, value:undefined, keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:null, value:undefined, keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:null, value:undefined, keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:null, value:undefined, keyField:'key', options:optionsList, asArray:false, asObject:false, },

                // expects array of objects
                {expected:null, value:1, keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:null, value:obj, keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:null, value:[1], keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:[], value:[], keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:[obj], value:[obj], keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:optionsList, value:optionsList, keyField:'key', options:optionsList, asArray:true, asObject:true, },
                {expected:[anyObj], value:[anyObj], keyField:'key', options:optionsList, asArray:true, asObject:true, },

                // expects one object
                {expected:null, value:1, keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:null, value:[1], keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:obj, value:obj, keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:objNotExist, value:objNotExist, keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:null, value:[], keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:null, value:[obj], keyField:'key', options:optionsList, asArray:false, asObject:true, },
                {expected:null, value:[anyObj], keyField:'key', options:optionsList, asArray:false, asObject:true, },

                //expect array of scalars
                {expected:null, value:1, keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:null, value:obj, keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:[obj], value:[2], keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:optionsList, value:[1,2], keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:optionsList, value:[2,1], keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:null, value:optionsList, keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:[], value:[7], keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:[], value:[], keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:null, value:[obj], keyField:'key', options:optionsList, asArray:true, asObject:false, },
                {expected:null, value:[anyObj], keyField:'key', options:optionsList, asArray:true, asObject:false, },

                //expect one scalar
                {expected:obj, value:2, keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:[], value:7, keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:null, value:obj, keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:null, value:[2], keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:null, value:[7], keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:null, value:[], keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:null, value:[obj], keyField:'key', options:optionsList, asArray:false, asObject:false, },
                {expected:null, value:[anyObj], keyField:'key', options:optionsList, asArray:false, asObject:false, },
            ]

            testCases.forEach((testCase, index) => {
                const {expected, ...testParams} = testCase;
                const params = Object.values(testParams);
                const result = this.toMultiSelectFormat(...params);
                assert.strictEqual(JSON.stringify(result), JSON.stringify(expected),
                    'testToMultiselectFormat('+index + '): Fallo con los params: ' +  params.toString())
            });
        },

        testConvertForEmit() {
            const testCases = [
                // with null
                {expected:[], value:null, keyField:'key', asArray:true, asObject:true},
                {expected:[], value:null, keyField:'key', asArray:true, asObject:false },
                {expected:null, value:null, keyField:'key', asArray:false, asObject:true},
                {expected:null, value:null, keyField:'key', asArray:false, asObject:false, },
                // with undefined
                {expected:[], value:undefined, keyField:'key', asArray:true, asObject:true},
                {expected:null, value:undefined, keyField:'key', asArray:false, asObject:true},
                {expected:[], value:undefined, keyField:'key', asArray:true, asObject:false},
                {expected:null, value:undefined, keyField:'key', asArray:false, asObject:false},
                // keys and objects
                {expected:[{key: '1', label:'one'}], value:[{key: '1', label:'one'}], keyField:'key', asArray:true, asObject:true },
                {expected:{key: '1', label:'one'}, value:{key: '1', label:'one'}, keyField:'key', asArray:false, asObject:true },
                {expected:['1'], value:[{key: '1', label:'one'}], keyField:'key', asArray:true, asObject:false},
                {expected:'1', value:{key: '1', label:'one'}, keyField:'key', asArray:false, asObject:false },
            ];

            testCases.forEach(testCase => {
                const {expected, ...testParams} = testCase;
                const params = Object.values(testParams);
                const result = this.convertForEmit(...params);
                assert.strictEqual(JSON.stringify(result), JSON.stringify(expected), 'Fallo con los params: ' +  params.toString())
            });
        }
    }
}
