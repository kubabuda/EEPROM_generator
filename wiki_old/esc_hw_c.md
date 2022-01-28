# What is in `esc_hw.c` ?

In this file, the routines for reading and writing the ESC (Beckhoff ET1100 or ET1200) are implemented. One function for writing bytes over SPI and one function for reading bytes over SPI should be implemented. While running the application, these functions could (will?) be called back-to-back, so make sure that the SPI buffers are completely empty and the transaction is completed before exiting the functions. See the comments in the code to understand what your function should do. 

## ALevent
While the microcontroller writes the address (for both read and write), the ET1100 or ET1200 returns the status of the ALevent register (word address 0x0220-0x0221). This is used by the SOES code to determine what actions need to be taken next. This register value is stored in the "ALevent" pointer location given to both functions.

