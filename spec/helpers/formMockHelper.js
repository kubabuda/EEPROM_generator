var formMock = {};

function buildMockFormHelper(formValues = null) {
    const defaultFormValues = getFormDefaultValues().form;
    
    if (!formValues) {
        formValues = defaultFormValues;
    }
    
    formMock = { }

    Object.keys(defaultFormValues).forEach(formControlName => {
        const formControl = { 
            name: formControlName, 
        };
        setFormControlValue(formControl, formValues[formControlName]);
        formMock[formControlName] = formControl;
    });

    return formMock;
}

function getForm() {
    return formMock;
}

function getEmptyFrom() {
    return {
        VendorName: { name: "VendorName", },
        VendorID: { name: "VendorID", },
        ProductCode: { name: "ProductCode", },
        ProfileNo: { name: "ProfileNo", },
        RevisionNumber: { name: "RevisionNumber", },
        SerialNumber: { name: "SerialNumber", },
        HWversion: { name: "HWversion", },
        SWversion: { name: "SWversion", },
        EEPROMsize: { name: "EEPROMsize", },
        RxMailboxOffset: { name: "RxMailboxOffset", },
        TxMailboxOffset: { name: "TxMailboxOffset", },
        MailboxSize: { name: "MailboxSize", },
        SM2Offset: { name: "SM2Offset", },
        SM3Offset: { name: "SM3Offset", },
        TextGroupType: { name: "TextGroupType", },
        TextGroupName5: { name: "TextGroupName5", },
        ImageName: { name: "ImageName", },
        TextDeviceType: { name: "TextDeviceType", },
        TextDeviceName: { name: "TextDeviceName", },
        Port0Physical: { name: "Port0Physical", },
        Port1Physical: { name: "Port1Physical", },
        Port2Physical: { name: "Port2Physical", },
        Port3Physical: { name: "Port3Physical", },
        ESC: { name: "ESC", },
        SPImode: { name: "SPImode", },
        CoeDetailsEnableSDO: { name: "CoeDetailsEnableSDO", },
        CoeDetailsEnableSDOInfo: { name: "CoeDetailsEnableSDOInfo", },
        CoeDetailsEnablePDOAssign: { name: "CoeDetailsEnablePDOAssign", },
        CoeDetailsEnablePDOConfiguration: { name: "CoeDetailsEnablePDOConfiguration", },
        CoeDetailsEnableUploadAtStartup: { name: "CoeDetailsEnableUploadAtStartup", },
        CoeDetailsEnableSDOCompleteAccess: { name: "CoeDetailsEnableSDOCompleteAccess", },
        GenerateDownload: { name: "GenerateDownload", },
        Generate: { name: "Generate", },
        Save: { name: "Save", },
        Restore: { name: "Restore", },
        Reset: { name: "Reset", },
    }
}

function validateResultLines(result, expected) {
    console.log(result);
    resultLines = result.split('\n');
    expectedLines = expected.split('\n');
    for (const [index, expectedLine] of expectedLines.entries()) {
        if(index > resultLines.length) {
            expect(resultLines.length).toEqual(expectedLines.length);
            break;
        }
        expect(resultLines[index]).toEqual(expectedLine);
        // if (resultLines[index] != expectedLine) {
        //     break;
        // }
    }
}