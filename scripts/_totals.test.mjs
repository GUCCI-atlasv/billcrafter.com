import { computeTotals, roundMoney, currencyDecimals, sectionSubtotal, money, taxModeOf } from "../lib/invoice.js";
let pass=0, fail=0;
const ok=(c,m)=>{c?pass++:(fail++,console.log("  FAIL:",m));};
const show=(n,c="USD")=>money(n,c,"en-US");

console.log("== 1. printed lines must sum to printed total ==");
let drift=0, checked=0;
for(let r=1;r<=200;r++) for(let q=1;q<=6;q++) for(const tax of [5,7.5,8.25,8.875,9.975,13,19,20,21,27]){
  const rate=r/40; // .025 steps -> lots of half-cent cases
  const t=computeTotals([{qty:q,rate,tax:true}],{taxRate:tax});
  const sum=roundMoney(t.subtotal - t.discAmt + t.taxAmt + t.ship, 2);
  checked++; if(sum!==t.total) drift++;
}
ok(drift===0, `${drift}/${checked} cases where lines don't sum to total`);
console.log(`  checked ${checked} combinations, drift=${drift}`);

console.log("== 2. the exact case from the old code ==");
{
  const t=computeTotals([{qty:1,rate:1.035,tax:true}],{taxRate:20});
  console.log(`  subtotal ${show(t.subtotal)} + tax ${show(t.taxAmt)} = total ${show(t.total)}`);
  ok(t.subtotal===1.04 && t.taxAmt===0.21 && t.total===1.25, "1.035 @20% must print 1.04 + 0.21 = 1.25");
}

console.log("== 3. VAT on the discounted base ==");
{
  const t=computeTotals([{qty:1,rate:1000,tax:true}],{taxRate:20,discVal:10,discType:"pct"});
  console.log(`  net 1000, -10% => taxableBase ${t.taxableBase}, VAT ${t.taxAmt}, total ${t.total}`);
  ok(t.taxableBase===900 && t.taxAmt===180 && t.total===1080, "UK VAT: 900 base, 180 VAT, 1080 total");
}

console.log("== 4. discount apportioned across taxable / non-taxable lines ==");
{
  // 600 taxable + 400 exempt = 1000 subtotal; 10% (=100) discount
  // taxable share 60% -> 60 of the discount lands on the taxable side
  const t=computeTotals([{qty:1,rate:600,tax:true},{qty:1,rate:400,tax:false}],
                        {taxRate:20,discVal:10,discType:"pct"});
  console.log(`  taxableBase ${t.taxableBase} (expect 540), tax ${t.taxAmt} (expect 108), total ${t.total}`);
  ok(t.taxableBase===540 && t.taxAmt===108 && t.total===1008, "pro-rata discount on mixed invoice");
}

console.log("== 5. zero-decimal currency (JPY) ==");
{
  const d=currencyDecimals("JPY");
  const t=computeTotals([{qty:3,rate:1333.33,tax:true}],{taxRate:10,decimals:d});
  console.log(`  JPY: subtotal ${t.subtotal} tax ${t.taxAmt} total ${t.total}`);
  ok(d===0, "JPY has 0 decimals");
  ok(Number.isInteger(t.subtotal)&&Number.isInteger(t.taxAmt)&&Number.isInteger(t.total), "no fractional yen anywhere");
  ok(roundMoney(t.subtotal-t.discAmt+t.taxAmt+t.ship,0)===t.total, "JPY lines sum to total");
}

console.log("== 6. flat discount larger than the invoice ==");
{
  const t=computeTotals([{qty:1,rate:100,tax:true}],{taxRate:20,discVal:500,discType:"flat"});
  console.log(`  disc ${t.discAmt} tax ${t.taxAmt} total ${t.total}`);
  ok(t.discAmt===100 && t.taxAmt===0 && t.total===0, "clamps to zero, never negative tax/total");
}

console.log("== 7. paid-in-full is exact, no epsilon ==");
{
  const t=computeTotals([{qty:3,rate:33.33,tax:true}],{taxRate:8.875});
  const t2=computeTotals([{qty:3,rate:33.33,tax:true}],{taxRate:8.875,paid:t.total});
  console.log(`  total ${t.total}, paid ${t.total} => due ${t2.due}`);
  ok(t2.due===0, "due is exactly 0 when paid equals total");
}

console.log("== 8. section subtotal matches its rows ==");
{
  const items=[{section:"Labor"},{qty:3,rate:1.035,tax:true},{qty:7,rate:2.005,tax:true}];
  const secs=sectionSubtotal(items,0);
  const rows=roundMoney(3*1.035,2)+roundMoney(7*2.005,2);
  console.log(`  section ${secs}, rows ${rows}`);
  ok(secs===roundMoney(rows,2), "section subtotal equals sum of printed rows");
}

console.log("== 9. roundMoney half-away-from-zero ==");
{
  ok(roundMoney(1.005,2)===1.01, "1.005 -> 1.01 (naive Math.round gives 1.00)");
  ok(roundMoney(2.675,2)===2.68, "2.675 -> 2.68");
  ok(roundMoney(-1.005,2)===-1.01, "-1.005 -> -1.01");
  ok(roundMoney(1.004999,2)===1.00, "1.004999 stays 1.00");
  ok(roundMoney(NaN,2)===0 && roundMoney(undefined,2)===0, "non-numbers -> 0");
}

console.log("== 10. legacy records keep the figures they were sent with ==");
{
  const items=[{qty:1,rate:1000,tax:true}], adj={taxRate:20,discVal:10,discType:"pct"};
  const legacy=computeTotals(items,{...adj,taxMode:"gross"});
  const fixed =computeTotals(items,{...adj,taxMode:"net"});
  console.log(`  gross: tax ${legacy.taxAmt} total ${legacy.total}   net: tax ${fixed.taxAmt} total ${fixed.total}`);
  ok(legacy.taxAmt===200 && legacy.total===1100, "gross reproduces the pre-fix numbers exactly");
  ok(fixed.taxAmt===180 && fixed.total===1080, "net is the corrected figure");
}

console.log("== 11. taxModeOf: absence means legacy ==");
{
  ok(taxModeOf({})==="gross", "record with no taxMode -> gross");
  ok(taxModeOf(null)==="gross", "missing record -> gross");
  ok(taxModeOf({taxMode:"net"})==="net", "stamped record -> net");
  ok(taxModeOf({taxMode:"gross"})==="gross", "explicit gross -> gross");
}

console.log("== 12. gross path is byte-for-byte the old arithmetic ==");
{
  const oldImpl=(items,{taxRate=0,discVal=0,discType="pct",shipping=0,paid=0,depositVal=0,depositType="pct"}={})=>{
    let subtotal=0,taxable=0;
    for(const it of items){ if(it.section!==undefined)continue;
      const amt=(Number(it.qty)||0)*(Number(it.rate)||0); subtotal+=amt; if(it.tax)taxable+=amt; }
    const taxAmt=(taxable*(Number(taxRate)||0))/100;
    const dv=Number(discVal)||0;
    const discAmt=discType==="pct"?(subtotal*dv)/100:dv;
    const ship=Number(shipping)||0;
    const total=subtotal+taxAmt+ship-discAmt;
    const due=total-(Number(paid)||0);
    const depv=Number(depositVal)||0;
    const depositAmt=depositType==="pct"?(total*depv)/100:depv;
    return {subtotal,taxAmt,discAmt,ship,total,due,depositAmt};
  };
  let diff=0,n=0;
  for(let r=1;r<=120;r++) for(const tax of [0,5,8.25,19,20]) for(const d of [0,7,10,33.3]){
    const items=[{qty:(r%5)+1,rate:r/7,tax:true},{qty:2,rate:r/3,tax:r%2===0}];
    const adj={taxRate:tax,discVal:d,discType:"pct",shipping:r%11,paid:r%23,depositVal:30,depositType:"pct"};
    const a=oldImpl(items,adj), b=computeTotals(items,{...adj,taxMode:"gross"});
    n++;
    for(const k of ["subtotal","taxAmt","discAmt","ship","total","due","depositAmt"]) if(a[k]!==b[k]) diff++;
  }
  console.log(`  compared ${n} records field-by-field, mismatches=${diff}`);
  ok(diff===0, "gross output is identical to the pre-fix implementation");
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
