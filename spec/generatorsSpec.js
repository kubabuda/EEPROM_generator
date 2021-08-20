describe("generators", function() {
  
    
    describe("for default, empty project", function() {
        var form;
        var od;
        var indexes;
        
        beforeEach(function() {
            form = buildMockFormHelper();
            od = buildObjectDictionary(form);
            indexes = getUsedIndexes(od);
        });
    
        it("utypes_generator should generate expected code", function() {
            // arrange
        
            // act
            var result = utypes_generator(form, od, indexes);

            // assert
            const expectedUtypes = 
`#ifndef __UTYPES_H__
#define __UTYPES_H__

#include "cc.h"

/* Object dictionary storage */

typedef struct
{
   /* Identity */

   uint32_t serial;

} _Objects;

extern _Objects Obj;

#endif /* __UTYPES_H__ */
`;
        expect(result).toEqual(expectedUtypes);
        });
    });
});
  