// -------------------------------------------------------------------------------------------
// Copyright 2001 - 2021, Sundial Capital Research, Inc. All rights reserved
// -------------------------------------------------------------------------------------------

function SortArray(x, y){
    return collator.compare(x.data.symbol, y.data.symbol);
}

export {SortArray}