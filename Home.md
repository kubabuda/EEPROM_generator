# Welcome to the SOES - Simple Open EtherCAT Slave Wiki

This Wiki was created to document the SOES code, and help developpers to create an EtherCAT slave based on the SOES code. The code is written by Arthur Ketels from [SMF Ketels](http://www.smfk.nl), who also wrote the Simple Open EtherCAT master that can be found [here](https://developer.berlios.de/projects/soem/). Installing SOEM on your develoment machine is encouraged as it provides valuable debugging tools to develop your own slave. 
This Wiki is created as part of a project to create a small (in physical size) EtherCAT slave based on the STM32F0. The code can be used on other architectures aswell, hints will be given in the documentation. The development is just starting out, so please be a bit patient on the results. 

## Code repository, useful links
* The code is hosted on bitbucket, [click here for the sources][Repository].
* The code is maintained in a [git](www.git-scm.com) repository. If you want to know more about git, I can recommend [git immersion as a quick start](http://www.gitimmersion.com).
* To use GIT repositories on Windows, [Git Extensions](http://code.google.com/p/gitextensions/) is one of the few (or only?) GUIs to use with GIT.
* Go to [Beckhoff's website](www.beckhoff.com) and the site of the [EtherCAT Technology Group](www.ethercat.org), and register as EtherCAT Technology Group Member to access the documents referred to in this Wiki. The EtherCAT Technology Group maintains the EtherCAT standards, which are the basis of all EtherCAT communication. If you want to create your own slave, you'll have to request a Vendor ID as well.


[Repository]: http://bitbucket.org/utwente_bss/soes_arm

Objlist
70010108-> 
			Index:		7001
			Subindex: 	  01
			Size:		   8 bits
			
Size moet kloppen met variablele in module
aantal variabelen moet kloppen in eerste string, en in SOobjects, 3de item

Subindexen oplopend!
Waar is de volgorde van variablen in Processdata gedefinieerd? Nu: hele struct wordt gestuurd, maar via mailbox is 'echte' waarde te lezen?