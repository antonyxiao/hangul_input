/* Hangul input from QWERTY

@author: Antony Xiao

AVAILBLE CHARACTERS:
single jamo
consonant + vowel
consonant + vowel + consonant
consonant + vowel + consonant + consonant
consonant + vowel + vowel
consonant + vowel + vowel + consonant
consonant + vowel + vowel + consonant + consonant


BUG:
    I1MFF I2M Deletion with certain I2 will result in I1MFF or I1MFF2 where F2 is I2

*/

var dynamicString = [];
var final_string = '';
var key = [];

var table = {
    65 : [0x1106, 6, -1, 16], // A ㅁ
    66 : [0x1172, -1, 17, -1], // B ㅠ
    67 : [0x110E, 14, -1, 23], // C ㅊ
    68 : [0x110B, 11, -1, 21], // D ㅇ
    69 : [0x1104, 4, -1, -1], // E ㄸ
    70 : [0x1105, 5, -1, 8], // F ㄹ
    71 : [0x1112, 18, -1, 27], // G ㅎ
    72 : [0x1169, -1, -1, -1], // H ㅗ
    73 : [0x1163, -1, 2, -1], // I ㅑ
    74 : [0x1165, -1, 4, -1], // J ㅓ
    75 : [0x1161, -1, 0, -1], // K ㅏ
    76 : [0x1175, -1, 20, -1], // L ㅣ
    77 : [0x1173, -1, 18, -1], // M ㅡ
    78 : [0x116E, -1, 13, -1], // N ㅜ
    79 : [0x1164, -1, 3, -1], // O ㅒ
    80 : [0x1168, -1, 7, -1], // P ㅖ
    81 : [0x1108, 8, -1, -1], // Q ㅃ
    82 : [0x1101, 1, -1, 2], // R ㄲ
    83 : [0x1102, 2, -1, 4], // S ㄴ
    84 : [0x110A, 10, -1, 20], // T ㅆ
    85 : [0x1167, -1, 6, -1], // U ㅕ
    86 : [0x1111, 17, -1, 26], // V ㅍ
    87 : [0x110D, 13, -1, -1], // W ㅉ
    88 : [0x1110, 16, -1, 25], // X ㅌ
    89 : [0x116D, -1, 12, -1], // Y ㅛ
    90 : [0x110F, 15, -1, 24], // Z ㅋ
    91 : [], // [
    92 : [], /* \ */
    93 : [], // ]
    94 : [], // ^
    95 : [], // _
    96 : [], // `
    97 : [0x1106, 6, -1, 16], // a ㅁ
    98 : [0x1172, -1, 17, -1], // b ㅠ
    99 : [0x110E, 14, -1, 23], // c ㅊ
    100 : [0x110B, 11, -1, 21], // d ㅇ
    101 : [0x1103, 3, -1, 7], // e ㄷ
    102 : [0x1105, 5, -1, 8], // f ㄹ
    103 : [0x1112, 18, -1, 27], // g ㅎ
    104 : [0x1169, -1, 8, -1], // h ㅗ
    105 : [0x1163, -1, 2, -1], // i ㅑ
    106 : [0x1165, -1, 4, -1], // j ㅓ
    107 : [0x1161, -1, 0, -1], // k ㅏ
    108 : [0x1175, -1, 20, -1], // l ㅣ
    109 : [0x1173, -1, 18, -1], // m ㅡ 
    110 : [0x116E, -1, 13, -1], // n ㅜ
    111 : [0x1162, -1, 1, -1], // o ㅐ
    112 : [0x1166, -1, 5, -1], // p ㅔ
    113 : [0x1107, 7, -1, 17], // q ㅂ
    114 : [0x1100, 0, -1, 1], // r ㄱ
    115 : [0x1102, 2, -1, 4], // s ㄴ
    116 : [0x1109, 9, -1, 19], // t ㅅ
    117 : [0x1167, -1, 6, -1], // u ㅕ
    118 : [0x1111, 17, -1, 26], // v ㅍ
    119 : [0x110C, 12, -1, 22], // w ㅈ
    120 : [0x1110, 16, -1, 25], // x ㅌ
    121 : [0x116D, -1, 12, -1], // y ㅛ
    122 : [0x110F, 15, -1, 24] // z ㅋ
};

compound_vowel_table = {
    [[8, 0]] : 9,
    [[8, 1]] : 10,
    [[8, 20]] : 11,
    [[13, 4]] : 14,
    [[13, 5]] : 15,
    [[13, 20]] : 16,
    [[18, 20]] : 19
};

compound_consonant_table = {
    [[1,19]] : 3,
    [[4, 22]] : 5,
    [[4, 27]] : 6,
    [[8, 1]] : 9,
    [[8, 16]] : 10,
    [[8, 17]] : 11,
    [[8, 19]] : 12,
    [[8, 25]] : 13,
    [[8, 26]] : 14,
    [[8, 27]] : 15,
    [[17, 19]] : 18
}; // compound_consonant_table

final_to_initial = {
    16 : 6, // ㅁ
    23 : 14, // ㅊ
    21 : 11, // ㅇ
    8 : 5, // ㄹ
    27 : 18, // ㅎ
    2 : 1, // ㄲ
    4 : 2, // ㄴ
    20 : 10, // ㅆ
    26 : 17, // ㅍ
    25 : 16, // ㅌ
    24 : 15, // ㅋ
    7 : 3, // ㄷ
    8 : 5, // ㄹ
    27 : 18, // ㅎ
    17 : 7, // ㅂ
    1 : 0, // ㄱ
    4 : 2, // ㄴ
    19 : 9, // ㅅ
    26 : 17, // ㅍ
    22 : 12, // ㅈ
    25 : 16, // ㅌ
    24  : 15// ㅋ
}

$(document).ready(function(){  
    $(document).keydown(function(e) {

        // backspace
        if (e.keyCode == 8) {

            console.log('DELETE');

            if (dynamicString) {
                
                if (dynStrLastElementLen() == 3 || dynStrLastElementLen() == 4) {
                
                    console.log('compound consonant delete');
                
                    dynamicString[dynamicString.length - 1].pop();
                    key.pop();
                    
                } else if (dynStrLastElementLen() == 2) {
                    
                    console.log('initial to final delete');
                    
                    // remaining single consonant jamo
                    // I from IM
                    let last_final_consonant = dynamicString[dynamicString.length - 1][0];
                    
                    // IM -> I
                    dynamicString[dynamicString.length - 1].pop();
                    
                    // copy last char into current frame
                    key.pop();
                    
                    // I(final) code -> I(initial) code
                    let new_final_consonant = 0
                    
                    // dictionary get key from value
                    for (let key in final_to_initial){
                        if (final_to_initial[key] == last_final_consonant) {
                            new_final_consonant = Number(key);
                        }// if
                    }// for
                    
                    // IM IM -> IMF
                    if (dynamicString.length > 1
                        && dynamicString[dynamicString.length - 2].length == 2) {
                
                        console.log('IM IM -> IMF');
                    
                        dynamicString.pop();
                        key.push(dynamicString[dynamicString.length - 1][1]);
                    
                        dynamicString[dynamicString.length - 1].push(new_final_consonant);
                        key.push(new_final_consonant);
                    
                    // IMF IM -> IMFF
                    } else if (dynamicString.length > 1
                        && dynamicString[dynamicString.length - 2].length == 3
                        && compound_consonant_table[ [dynamicString[dynamicString.length - 2][2], new_final_consonant] ]) {
                    
                        console.log('IMF IM -> IMFF');
                        
                        dynamicString.pop();
                        key.push(dynamicString[dynamicString.length - 1][1]);
                        
                        dynamicString[dynamicString.length - 1].push(new_final_consonant);
                        key.push(new_final_consonant);
                    
                    } else {
                        
                        console.log('back to single jamo');
                        
                        let single_jamo = 0;
                        
                        for (let key in table){
                            if (table[key][1] == dynamicString[dynamicString.length - 1][0]) {
                                single_jamo = table[key][0];
                            }// if
                        }// for
                        
                        dynamicString[dynamicString.length - 1] = [single_jamo];
                        
                    }
                
                } else {
                    
                    console.log('block delete');
                    
                    dynamicString.pop();
                    
                    // bring to frame if last char is a hangul
                    if (dynStrLastElementLen() > 1) {
                        key = JSON.parse(JSON.stringify(dynamicString[dynamicString.length - 1]));;
                    } else {
                        key.pop();
                    }
                    
                } // else if
                
                printResult();
            }// if
        }// if
    });

    $(document).keypress(function(e) {
    
        console.log('KEY PRESS');
        
        // is jamo
        if (e.keyCode >= 65 && e.keyCode <= 122 && !(e.keyCode >= 91 && e.keyCode <= 96)) {
            let carryOver = false;
            let carryOverConsonant = 0;

            // new jamo and currently I
            if (size() == 0 || size() == 1) {
                
                key.push(table[e.keyCode][size()+1]);
            
            // currently IM
            } else if (size() == 2) {
                
                let temp_code = table[e.keyCode][2];
                
                // compound vowel
                if (compound_vowel_table[ [key[1], temp_code] ]) {
                    
                    key[1] = compound_vowel_table[ [key[1],temp_code] ];
                
                } else { // final consonant
            
                    key.push(table[e.keyCode][3]);
                
                }
                
            // currently IMF / IMMF
            } else if (size() == 3) {
            
                let temp_code = table[e.keyCode][3];
            
                // IMF -> IMFF
                if (compound_consonant_table[ [key[2], temp_code] ]) {
                    
                    // generate the 4th element
                    key.push(temp_code);
                
                // vowel (M2) pressed: IM1F M2 -> IM IM
                } else if (table[e.keyCode][2] != -1) {
                    
                    carryOver = true;
                    carryOverConsonant = final_to_initial[key[size() - 1]];
                    
                    // remove last final consonant
                    // key size will fall back to 2
                    key.pop();
                    
                // consonant pressed: compound final consonant not available
                } else {
                    
                    // begin a new character
                    reset();
                
                    key.push(table[e.keyCode][1]); // append 2nd element to key
                    
                }// else
                
            // currently IMFF / IMMFF
            } else {
                
                if (table[e.keyCode][1] == -1) {
            
                    carryOver = true;
                    carryOverConsonant = final_to_initial[key[size() - 1]];
                    
                    // remove last final consonant
                    // key size will be 3
                    key.pop();
                
                } else {
                    
                    // begin a new character
                    reset();
                
                    key.push(table[e.keyCode][1]); // append 2nd element to key
                    
                }
            }// else if
            
            
            dynamicStringProcessing(e, carryOver, carryOverConsonant);
            
                        
        } else { // not jamo
        
            dynamicString.push([e.charCode]);
            
            reset();
            
            // since pointer starts at 0
            
                
        }// else
        
        printResult();


    });// keypress
});// ready

function dynamicStringProcessing(e, carryOver, carryOverConsonant) {
    
     /*** print processing ***/
    if (size() == 1) {
        console.log('print processing 1');
        dynamicString.push([table[e.keyCode][0]]);

        // single vowel jamo
        if (key[0] == -1) {
            reset();
        }// if
        
    } else if (size() == 2) {
        console.log('print processing 2');
        // single consonant jamo
        if (key[1] == -1) {
            
            console.log('consonant');
            
            dynamicString.push([table[e.keyCode][0]]);
            
            // make key available for a possible medial vowel
            key.pop();
            
        } else {
            
            console.log('vowel');
            
            dynamicString[dynamicString.length - 1] = [key[0], key[1]];
            
            if (carryOver) {
                
                console.log('size 2 carry over');
                
                // begin a new character
                reset();
                
                key.push(carryOverConsonant);
                key.push(table[e.keyCode][2]);
                
                dynamicString.push([key[0], key[1]]);
            }
        }// else
        
    } else if (size() == 3) {
        console.log('print processing 3');
        
        if (key[2] == -1) {
            
            console.log('vowel');
            
            dynamicString.push([table[e.keyCode][0]]);
            
            reset();
            
        
        } else {
            
            console.log('consonant');
            
            dynamicString[dynamicString.length - 1] = [key[0], key[1], key[2]];
            
            if (carryOver) {
                console.log('size 3 carry over');
                // begin a new character
                reset();
                
                
                key.push(carryOverConsonant);
                key.push(table[e.keyCode][2]);
                
                dynamicString.push([key[0], key[1]]);
            }
            
        }// else
        
    } else if (size() == 4) {
        
        console.log('printing 4');
        
        if (key[3] == -1) {
            
            console.log('vowel');
            
            dynamicString.push([table[e.keyCode][0]]);
            
        } else {
        
            console.log('consonant');
            
            dynamicString[dynamicString.length - 1] = [key[0], key[1], key[2], key[3]];
        
        }
        
    }// else if
                    
}// dynamicStringProcessing

function printResult() {
    let string = '';
    
    for (let i of dynamicString) {
        if (!i) {
            continue;
        } else if (i.length == 1) {
            string += String.fromCharCode(i[0]);
        } else if (i.length == 2) {
            dec_uni = calculate(i[0], i[1], 0);
            string += String.fromCharCode(dec_uni);
        } else if (i.length == 3) {
            dec_uni = calculate(i[0], i[1], i[2]);
            string += String.fromCharCode(dec_uni);
        } else if (i.length == 4) {
            let compound_code = compound_consonant_table[ [i[2], i[3]] ];
            dec_uni = calculate(i[0], i[1], compound_code);
            string += String.fromCharCode(dec_uni);
        }
    }// for
    
    $('#output').html(string);
}

function calculate(init, med, fin) {
    return ((init * 588) + (med * 28) + fin) + 44032    
}

function reset() {
    key = [];
}// reset

function size() {
    return key.length;
}

function dynStrLastElementLen() {
    if (dynamicString[dynamicString.length - 1]) {
        return dynamicString[dynamicString.length - 1].length;        
    }
    
    return 0;
}