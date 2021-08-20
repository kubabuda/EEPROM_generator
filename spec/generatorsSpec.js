describe("generators", function() {
  
    beforeEach(function() {
    });
  
    it("utypes_generator", function() {
      // arrange
      const form = buildMockFormHelper();
      const od = buildObjectDictionary(form);
      const indexes = getUsedIndexes(od);
  
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
  