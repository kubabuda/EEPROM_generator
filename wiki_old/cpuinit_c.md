# What is in `cpuinit.c` ?

In cpuinit.c, you only have to initialize your microcontroller. Take care that all IO pins that need to be initialized are initialized here, and setup the SPI peripheral. Alternatively, you can do this at the start of main in soes.c, but this is not recommended. 