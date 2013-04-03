# Main code

## Initialisation

```
#!c
   cpuinit();
	TXPDOsize = sizeTXPDO();
	RXPDOsize = sizeRXPDO();
    _delay_ms(200);
    /*initialize configuration*/
    Eb.setting16 = 0xABCD;
    Eb.setting8  = 111;
    // wait until ESC is started up
    while ((ESCvar.DLstatus & 0x0001) == 0)
        ESC_read(ESCREG_DLSTATUS, &ESCvar.DLstatus, sizeof(ESCvar.DLstatus), &ESCvar.ALevent);

// reset ESC to init state
    ESC_ALstatus(ESCinit);
    ESC_ALerror(ALERR_NONE);
    ESC_stopmbx();
    ESC_stopinput();
    ESC_stopoutput();
```
First the [CPU initialisation](cpuinit_c) is called. This is specific to your microcontroller of choice. Then, the size of the TxPDO and RxPDO objects are determined. These functions exist to make it possible to change your [objectlist.h](objectlist_h) without having to change your main code.
The 'Eb' buffer is meant for settings (implying EEPROM data), the last saved (or default) settings are initialized here before communicating with the master. After that, the microcontroller waits until the ESC (ET1100 or ET1200) has downloaded its info from the EEPROM.
Before entering the main loop, all communication settings are reset.

## main loop
The code in the main function is this block:
```
#!c
   while (1)
    {
        ESC_read(ESCREG_LOCALTIME, &ESCvar.Time, sizeof(ESCvar.Time), &ESCvar.ALevent);
        ESC_ALevent();
        ESC_state();
        if (ESC_mbxprocess())
        {
            ESC_coeprocess();
            ESC_xoeprocess();
        }
        DIG_process();
    }
```
The endless loop in main reads the local time of the ESC, and gets both the local time and the ALevent value (as described in [esc_hw.c](esc_hw_c)). After that, action is undertaken based on the ALevent value, and the local state machine is maintained.

if a mailbox process is taking place, the function `ESC_coeprocess()` handles the CANOpen over EtherCAT mailbox communication. All other mailbox protocols are not supported. ESC_xoeprocess() handles that by replying to the master that those mailbox protocols are not supported.

`DIG_Process()` (declared and implemented in soes.c) synchronises the received inputs with the peripheral world of the microcontroller, and reads values from the peripheral world to later send to the master. 
These functions are called in an endless loop. Depending on your application, take care that all actions can be performed well within the cycle time of the final application.... 

# Functions and Callbacks
## APP_safeoutput
Called to make outputs safe when going from 'OP' to 'SAFEOP'
## TXPDO_update
Send Receive buffer (data from slave to master) to ESC, when the master will read the data from the slave, it will read the latest data sent in this function
## RXPDO_update
Get Transmit buffer (data from master to slave) from ESC, when the microcontoller reads data from the ESC, it is the latest value written by the master.
## ESC_objecthandler(uint16 index, uint8 subindex)
Handle all CoE objects that are being sent to the slave using CoE mailbox communication. For example, this is where you can handle settings data (SDO8000 already maps to RAM buffer 'Eb', but here you might perform an EEPROM write.)
