
var tableStatDescription = "\n" +
	
		"\n    Table statistiques show 5bits values distribution" +
		"\n" +
		"\n        Index : from 0 to 31" +
		"\n" +
		"\n        Interpret statistique value as number of time the corresponding index value has been got" ;

		
var reversibleTableText = "Reversibility table : <span style='color:#00aa00'>Sync</span>";

var notReversibleTableText = "Reversibility table : <span style='color:#dd0000'>Not Sync</span>";
		
var texts = {

	// index

	'ref_8bitsIndex' : "Display : reference index from 0 to 31 then 32 to 255" +
	
		"\n" +
		"\n    Just a visual index for the other columns" ,

	// right bit shift 3
		
	'tbl_8bits_rbs3' : "Calc result table : right bit shift 3" +
	
		"\n" +
		"\n    For each value from 0 to 255" +
		"\n        value >> 3" ,
	
	'stat_tbl_8bits_rbs3' : "Table statistiques display : right bit shift 3" +
	
		tableStatDescription,

	// reduce then right bit shift 3
	
	'tbl_8bits_rtrbs3' : "Calc result table : reduce then right bit shift 3" +

		"\n" +
		"\n    For each value from 0 to 255" +
		"\n        value >> reduce" +
		"\n        value << reduce" +
		"\n        value >> 3" +
		"\n" +
		"\n    By default reduce is 4" +
		"\n" +
		"\n    Hold CRTL + SHIFT and use mouse wheel to increase or decrease reduce value" +
		"\n        reduce : from 0 to 8" ,
		
	'stat_tbl_8bits_rtrbs3' : "Table statistiques display : reduce then right bit shift 3" +
	
		tableStatDescription,
		
	// multiplier then floor
	
	'tbl_8bits_fm' : "Calc result table : multiplier then floor" +
	
		"\n" +
		"\n    For each value from 0 to 255" +
		"\n        floor( mutiplier * value )" +
		"\n" +
		"\n    multiplier is 31 / 255" ,
		
	'stat_tbl_8bits_fm' : "Table statistiques display : multiplier then floor" +
	
		tableStatDescription,
	
	// multiplier then + 0.X then floor
	
	'tbl_8bits_fmp05' : "Calc result table : multiplier then + 0.X then floor" +
	
		"\n" +
		"\n    For each value from 0 to 255" +
		"\n        floor( (mutiplier * value) + 0.X )" +
		"\n        value > 31 ? 31 : value" +
		"\n" +
		"\n    multiplier is 31 / 255" +
		"\n" +
		"\n    By default 0.X is 0.5" +
		"\n" +
		"\n    Hold CRTL + SHIFT and use mouse wheel to increase or decrease 0.X value" +
		"\n        0.X : from 0.0 to 1.0" ,
		
	'stat_tbl_8bits_fmp05' : "Table statistiques display : multiplier then + 0.X then floor" +
	
		tableStatDescription,
	
	// ref table : 5bits to 8bits
	
	'tbl_5bits_to_8bits' : "Reference table : 5bits to 8bits pre-made table" +
	
		"\n" +
		"\n    A simple hard coded reference table to convert from 5bits value to 8 bits value" +
		"\n" +
		"\n    Index : from 0 to 31. 5bits value used as index to get the 8bits value corresponding to it" +
		"\n" +
		"\n    This table is used to build next (blue) columns" ,
		
	// from 5bits to 8bits reference table
		
	'tbl_8bits_to_5bits' : "Built table : from 5bits to 8bits reference table" +
	
		"\n" +
		
		"\n    stepFrom = 0, stepTo = 1" +
		
		"\n    For each value from 0 to 255" +
		
		"\n        if ( value == 5bits_to_8bits_table[ stepTo ] )" +
		"\n            stepFrom = stepTo" +
		"\n            stepTo++" +
		
		"\n        corresponding value is stepFrom" ,
	
	'stat_tbl_8bits_to_5bits' : "Table statistiques display : from 5bits to 8bits reference table" +
	
		tableStatDescription,
		
	// from 5bits to 8bits reference table with smooth offset influance
		
	'stbl_8bits_to_5bits' : "Built table : from 5bits to 8bits reference table with smooth offset influance" +
	
		"\n" +
		
		"\n    stepFrom = 0, stepTo = 1" +
		"\n    stepBetween = ( 5bits_to_8bits_table[ stepTo ] - 5bits_to_8bits_table[ stepFrom ] ) >> 1" +
		"\n    stepBetween += 5bits_to_8bits_table[ stepFrom ] + smooth" +
		
		"\n    For each value from 0 to 255" +
		
		"\n        if ( value == 5bits_to_8bits_table[ stepTo ] && stepTo < 31 )" +
		"\n            stepFrom = stepTo" +
		"\n            stepTo++" +
		"\n            stepBetween = ( 5bits_to_8bits_table[ stepTo ] - 5bits_to_8bits_table[ stepFrom ] ) >> 1" +
		"\n            stepBetween += 5bits_to_8bits_table[ stepFrom ] + smooth" +
		
		"\n        if( value <= stepBetween)" +
		"\n            corresponding value is stepFrom" +
		"\n        else" +
		"\n            corresponding value is stepTo" +
		
		"\n" +
		"\n    By default smooth is 0" +
		"\n" +
		"\n    Hold CRTL + SHIFT and use mouse wheel to increase or decrease smooth value" +
		"\n        smooth : from -10 to 10" ,
		
	'stat_stbl_8bits_to_5bits' : "Table statistiques display : from 5bits to 8bits reference table with smooth offset influance" +
	
		tableStatDescription
};






