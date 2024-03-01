/**
 * SOES EEPROM generator
 * Files input and output

 * This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2024
 */
'use strict'

// ####################### Binary file output operations ####################### //

/** takes bytes array, returns Intel Hex as string */
function toIntelHex(record) {
	let hex = "";
	const bytes_per_rule = 32;
	const rulesTotalCount = record.length/bytes_per_rule;

	for (let rulenumber = 0 ; rulenumber < (rulesTotalCount); rulenumber++)
	{
		const sliceStart = rulenumber*bytes_per_rule;
		const sliceEnd = bytes_per_rule + (rulenumber * bytes_per_rule);
		const recordSlice = record.slice(sliceStart, sliceEnd);
		hex += CreateiHexRule(bytes_per_rule, rulenumber, recordSlice);
	}
	//end of file marker
	hex += ':00000001FF';
	return hex.toUpperCase();

	function CreateiHexRule(bytes_per_rule, rulenumber, record)
	{
		let record_type_datarecord  = '00';
		let rule = ':'+ bytes_per_rule.toString(16).slice(-2) + generate_hex_address(rulenumber*bytes_per_rule) + record_type_datarecord;
		for (let byteposition = 0; byteposition < bytes_per_rule ; byteposition++)
		{
			let byte = record[byteposition].toString(16).slice(-2); // convert to hexadecimal, crop to last 2 digits
			if(byte.length < 2)
				byte = '0' + byte; //minimal field width  = 2 characters.
			rule += byte;
		}
		let checksum  = 0;
		for (let rule_pos = 0 ; rule_pos < (rule.length-1)/2 ; rule_pos++)
		{
			let byte = parseInt(rule.slice(1+(2*rule_pos), 3+(2*rule_pos)),16);
			checksum  += byte;
		}
		checksum %= 0x100; //leave last byte
		checksum = 0x100-checksum; //two's complement
		rule += checksum.toString(16).slice(-2) + '\n';
		return rule;
	}
	/** takex number, returns its hexadecimal value padded/trimmed to 4 digits */
	function generate_hex_address(number)
	{
		//convert to hexadecimal string
		let output = number.toString(16);
		//take care that 4 characters are present
		while(output.length<4)
		{
			output ='0' + output;
		}
		//return 4 characters, prevents overflow
		return output.slice(-4);
	}
}

/** takes bytes array, returns esi.h equivalent: EEPROM content as C header, as JS string */
function toEsiEepromH(bytes) {
	let result = ["#ifndef __ESI_EEPROM_H__\n#define __ESI_EEPROM_H__\n\nunsigned char esiEepromData[] = {\n"];
	let line = 0;
	const last_i = bytes.length - 1;
	for (const [i, b] of bytes.entries()) {
		result.push(toByte(b));
		line++;
		if (i >= last_i) {
			break;
		}
		if (line >= 16) {
			result.push(`,\n`);
			line = 0;
		}
		else {
			result.push(',');
		}
	}
	result.push('\n};\n#endif __ESI_EEPROM_H__');
	return result.join('');

	function toByte(b) {
		const BB = (b).toString(16).toUpperCase();
		return b >= 16? `0x${BB}` : `0x0${BB}`;
	}
}