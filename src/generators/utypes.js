/**
 * SOES EEPROM generator
 * utypes.h code generation logic

* This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2024
 */
'use strict'

// ####################### utypes.h generation ####################### //

function utypes_generator(form, od, indexes) {
	let utypes = '#ifndef __UTYPES_H__\n#define __UTYPES_H__\n\n#include "cc.h"\n\n/* Object dictionary storage */\n\ntypedef struct\n{\n   /* Identity */\n'
	utypes += '\n   uint32_t serial;\n';
	
	let utypesInputs = '\n   /* Inputs */\n'; 
	let utypesOutputs = '\n   /* Outputs */\n';
	let hasInputs = isPdoWithVariables(od, indexes, txpdo); 
	let hasOutputs = isPdoWithVariables(od, indexes, rxpdo);

	indexes.forEach(index => {
		const objd = od[index];
		if (objd.pdo_mappings) {
			if(objd.pdo_mappings.length > 1) { alert(`${index} ${objd.name} Generating utypes.h for objects with multiple PDO mappings is not yet supported`); }
			
			const line = getUtypesDeclaration(objd);			
			
			if (objd.pdo_mappings[0] == txpdo)  {
				utypesInputs += line;
			} else {
				utypesOutputs += line;
			}
		}
	});
	
	if (hasInputs) { utypes += utypesInputs + '\n'; }
	if (hasOutputs) { utypes += utypesOutputs + '\n'; }
	
	let parameters = '\n   /* Parameters */\n';
	let anyParameters = false;
	indexes.forEach(index => {
		const objd = od[index];
		if (objd.isSDOitem) {
			parameters += getUtypesDeclaration(objd);
			anyParameters = true;
		}
	});
	if (anyParameters)  { 
		utypes += parameters;
	}

	utypes += '\n} _Objects;\n\nextern _Objects Obj;\n\n#endif /* __UTYPES_H__ */\n';
	
	return utypes;
	
	function getUtypesDeclaration(objd) {
		const varName = variableName(objd.name);
		switch (objd.otype) {
			case OTYPE.VAR: {
				const ctype = ESI_DT[objd.dtype].ctype;
				let suffix = '';
				if (objd.dtype == DTYPE.VISIBLE_STRING) {
					suffix = `[${objd.size}]`;
				}
				return `\n   ${ctype} ${varName}${suffix};`
			}
			case OTYPE.ARRAY: {
				const ctype = ESI_DT[objd.dtype].ctype;
				return `\n   ${ctype} ${varName}[${objd.items.length - 1}];`
			}
			case OTYPE.RECORD: {
				let section = `\n   struct\n   {`;
				/* TODO test */
				objd.items.slice(1).forEach(subitem => {
					const subitemCType = ESI_DT[subitem.dtype].ctype;
					const subitemName = variableName(subitem.name);
					section += `\n      ${subitemCType} ${subitemName};`
				});
				section += `\n   } ${varName};`
				return section;
			}
			default: {
				alert(`Cannot generate utypes.h for object ${objd?.name} with has unexpected OTYPE ${objd?.otype}`);
				return '';
			}
		}
	}
}
