import Interpreter from "../source/Interpreter";

test("Test GETA, GETB.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        GETA var_a
        GETB var_b
        HALT
        
        var_a:
        .data 10.25f
        
        var_b:
        .data 5
    `);

    expect(interpreter.registerA).toStrictEqual(new Float32Array([ 10.25 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 5 ]));
});

test("Test VGETA, VGETB.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 7
        VGETB 15.25f
        HALT
    `);

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 7 ]));
    expect(interpreter.registerB).toStrictEqual(new Float32Array([ 15.25 ]));
});

test("Test PUSH, VPUSH, STOREPUSH, SAVEPUSH.", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        STOREPUSH 289f
        PUSH var_a
        VPUSH 12
        
        VPUSH 69
        GETPOPR
        SAVEPUSH
        
        HALT
        
        var_a:
        .data 10.25f
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 69 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 12 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 10.25 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 289 ]));
});

test("Test MOVOUTPUSH.", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VPUSH var_a
        GETPOPR
        MOVOUTPUSH            
        HALT
        
        var_a:
        .data 10.25f
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 10.25 ]));
});

test("Test POPNOP, POP, GETPOPA, GETPOPB, GETPOPR, MOVINPOP.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VPUSH var_b
        VPUSH 128
        VPUSH 64
        VPUSH 32      
        VPUSH 16
        VPUSH 0
        
    
        POPNOP
        POP var_a
        GETPOPA
        GETPOPB
        GETPOPR
        
        MOVINPOP

        HALT
        
        var_a:
        .data 0
        
        var_b:
        .data 0
    `);

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 32 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 128 ]));
});

test("Test SAVE, SAVEA, SAVEB, SAVETOA, SAVETOB.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VPUSH 128
        VPUSH 64
        VPUSH 32
        
        GETPOPA
        GETPOPB
        GETPOPR
        
        SAVE var_a
        SAVEA var_b
        SAVEB var_c
        
        SAVETOA
        SAVETOB
    
        HALT
        
        var_a:
        .data 0
        
        var_b:
        .data 0
        
        var_c:
        .data 0
    `);

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 32 ]));
    expect(interpreter.memoryRegions.get("var_c")).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 128 ]));
});

test("Test JMP.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        JMP test
        HALT
        
        test:
        VGETA 128
        HALT
    `);

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 128 ]));
});

test("Test CALL, RTN.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        CALL test
        VGETB 64
        HALT
        
        test:
        VGETA 128
        RTN
    `);

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 128 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 64 ]));
});

test("Test JA, JNA.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 6.4f
        JA true
    false:
        VGETB 0
        JMP finish
    true:
        VGETB 1
    finish:
        HALT
    `);

    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 1 ]));

    await interpreter.run(`
        VGETA 0
        JNA false
    true:
        VGETB 0
        JMP finish
    false:
        VGETB 1
    finish:
        HALT
    `);

    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 1 ]));
});

test("Test MOV.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        MOV var_a var_b
        HALT
        
        var_a:
        .data 16
        
        var_b:
        .data 0
    `);

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 16 ]));
});

test("Test MOVIN.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VPUSH var_b
        GETPOPR
        MOVIN var_a     
        HALT
        
        var_a:
        .data 16
        
        var_b:
        .data 0
    `);

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 16 ]));
});

test("Test MOVOUT.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VPUSH var_a
        GETPOPR
        MOVOUT var_b     
        HALT
        
        var_a:
        .data 16
        
        var_b:
        .data 0
    `);

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 16 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 16 ]));
});

test("Test ADD.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB 20
        ADD
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 30 ]));

    await interpreter.run(`
        VGETA -10
        VGETB 20
        ADD
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 10 ]));
});

test("Test SADD.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB 20
        SADD
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 30 ]));

    await interpreter.run(`
        VGETA -10
        VGETB 20
        SADD
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 10 ]));
});

test("Test FADD.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 12.5f
        VGETB 22.5f
        FADD
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 35 ]));

    await interpreter.run(`
        VGETA -10f
        VGETB 20f
        FADD
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 10 ]));
});

test("Test SUB.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB 20
        SUB
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ -10 ]));

    await interpreter.run(`
        VGETA -10
        VGETB 20
        SUB
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ -30 ]));
});

test("Test SSUB.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB -20
        SSUB
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 30 ]));

    await interpreter.run(`
        VGETA -10
        VGETB 20
        SSUB
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ -30 ]));
});

test("Test FSUB.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10.5f
        VGETB -20.5f
        FSUB
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 31 ]));

    await interpreter.run(`
        VGETA -10.5f
        VGETB 20.5f
        FSUB
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ -31 ]));
});

test("Test DIV.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB 2
        DIV
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 5 ]));

    await interpreter.run(`
        VGETA 2
        VGETB 3
        DIV
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test SDIV.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB -2
        SDIV
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ -5 ]));

    await interpreter.run(`
        VGETA -10
        VGETB -10
        SDIV
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 1 ]));
});

test("Test FDIV.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 11f
        VGETB -2f
        FDIV
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ -5.5 ]));

    await interpreter.run(`
        VGETA -10f
        VGETB -10f
        FDIV
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 1 ]));
});

test("Test MULT.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB 2
        MULT
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 20 ]));

    await interpreter.run(`
        VGETA 0
        VGETB 3
        MULT
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test SMULT.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10
        VGETB -2
        SMULT
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ -20 ]));

    await interpreter.run(`
        VGETA -10
        VGETB -10
        SMULT
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Int32Array([ 100 ]));
});

test("Test FMULT.", async () => {
    const interpreter = new Interpreter();
    await interpreter.run(`
        VGETA 10f
        VGETB -2f
        FMULT
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ -20 ]));

    await interpreter.run(`
        VGETA -10f
        VGETB -10f
        FMULT
        HALT
    `);

    expect(interpreter.registerR).toStrictEqual(new Float32Array([ 100 ]));
});

test("Test CMPE, CMPNE, CMPLT, CMPLTE, CMPGT, CMPGTE", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 10
        VGETB 20
        
        CMPE
        SAVEPUSH
        
        CMPNE
        SAVEPUSH
        
        CMPLT
        SAVEPUSH
        
        CMPLTE
        SAVEPUSH
        
        CMPGT
        SAVEPUSH
        
        CMPGTE
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test SCMPE, SCMPNE, SCMPLT, SCMPLTE, SCMPGT, SCMPGTE", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 10
        VGETB -20
        
        SCMPE
        SAVEPUSH
        
        SCMPNE
        SAVEPUSH
        
        SCMPLT
        SAVEPUSH
        
        SCMPLTE
        SAVEPUSH
        
        SCMPGT
        SAVEPUSH
        
        SCMPGTE
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test FCMPE, FCMPNE, FCMPLT, FCMPLTE, FCMPGT, FCMPGTE", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 10.25f
        VGETB -20f
        
        FCMPE
        SAVEPUSH
        
        FCMPNE
        SAVEPUSH
        
        FCMPLT
        SAVEPUSH
        
        FCMPLTE
        SAVEPUSH
        
        FCMPGT
        SAVEPUSH
        
        FCMPGTE
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test NEG, SNEG, FNEG", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 128
        NEG
        SAVEPUSH
        
        VGETA 0
        NEG
        SAVEPUSH
        
        VGETA 100
        SNEG
        SAVEPUSH
        
        VGETA -100
        SNEG
        SAVEPUSH
        
        VGETA 10.5f
        FNEG
        SAVEPUSH
        
        VGETA -10.5f
        FNEG
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 10.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ -10.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 100 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ -100 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test INC, FINC, DEC, FDEC", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 128
        INC
        SAVEPUSH
        
        VGETA 0
        DEC
        SAVEPUSH
        
        VGETA 100.5f
        FINC
        SAVEPUSH
        
        VGETA 50.5f
        FDEC
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 49.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 101.5 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ -1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 129 ]));
});

test("Test REM, AND, SHIFTL, SHIFTR", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 128
        VGETB 5
        REM
        SAVEPUSH
        
        VGETA 268435455
        VGETB 252645135
        AND
        SAVEPUSH
        
        VGETA 128
        VGETB 1
        SHIFTR
        SAVEPUSH
        
        VGETA 128
        VGETB 1
        SHIFTL
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 256 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 252645135 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 3 ]));
});

test("Test NOT, OR, XOR", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 4042322160
        NOT
        SAVEPUSH
        
        VGETA 0
        VGETB 4042322160
        OR
        SAVEPUSH
        
        VGETA 252645135
        VGETB 4042322160
        XOR
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 4294967295 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 4042322160 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 252645135 ]));
});

test("Test FLTOINT, INTTOFL", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 12.5f
        FLTOINT
        SAVEPUSH
        
        VGETA 12
        INTTOFL
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Float32Array([ 12 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 12 ]));
});

test("Test LAND", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 0
        VGETB 0
        LAND
        SAVEPUSH
        
        VGETA 1
        VGETB 0
        LAND
        SAVEPUSH
        
        VGETA 0
        VGETB 1
        LAND
        SAVEPUSH
        
        VGETA 1
        VGETB 1
        LAND
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test LOR", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        VGETA 0
        VGETB 0
        LOR
        SAVEPUSH
        
        VGETA 1
        VGETB 0
        LOR
        SAVEPUSH
        
        VGETA 0
        VGETB 1
        LOR
        SAVEPUSH
        
        VGETA 1
        VGETB 1
        LOR
        SAVEPUSH

        HALT
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 1 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Uint32Array([ 0 ]));
});

test("Test QADD, QSUB, QSTORE, STORE", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`     
        QSTORE 64 var_a
        STORE 128 var_b 
        
        QSUB -128 32
        SAVEPUSH
        
        QADD 128 32
        SAVEPUSH

        HALT
        
        var_a:
        .data 0
        
        var_b:
        .data 0
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 160 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ -160 ]));

    expect(interpreter.memoryRegions.get("var_a")).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 128 ]));

});

test("Test QLADD, QLSUB", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`
        QLADD var_a 10
        SAVEPUSH
        
        QLADD var_a var_b
        SAVEPUSH
            
        QLSUB var_a 10
        SAVEPUSH
        
        QLSUB var_a var_b
        SAVEPUSH

        HALT
        
        # $9
        var_a:
        .data 64
        .read var_a var_a
        
        # $10
        var_b:
        .data 128
        .read var_b var_b
    `);

    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 54 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 54 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 74 ]));
    expect(interpreter.stack.pop()).toStrictEqual(new Int32Array([ 74 ]));
});

test("Test GETAVB", async () => {
    const interpreter = new Interpreter();
    await interpreter.runWithoutStackCheck(`      
        GETAVB var_a 10    
        SAVEB var_b
        
        GETAVB var_a var_b    
        
        HALT
        
        var_a:
        .data 64
        .read var_a var_a

        var_b:
        .data 128
        .read var_b var_b
    `);

    expect(interpreter.registerA).toStrictEqual(new Uint32Array([ 64 ]));
    expect(interpreter.registerB).toStrictEqual(new Uint32Array([ 5 ]));
    expect(interpreter.memoryRegions.get("var_b")).toStrictEqual(new Uint32Array([ 10 ]));
});