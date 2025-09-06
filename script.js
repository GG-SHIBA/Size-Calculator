function calculatePosition() { 
    const entry = parseFloat(document.getElementById('entry').value);
    const sl = parseFloat(document.getElementById('sl').value);
    const tp = parseFloat(document.getElementById('tp').value);
    const risk = parseFloat(document.getElementById('risk').value);

    if(isNaN(entry) || isNaN(sl) || isNaN(tp) || isNaN(risk) || entry === sl || entry === tp || sl === tp) {
        document.getElementById("calculatorResult").style.display = "none";
        document.getElementById("calculatorError").style.display = "block";
        document.getElementById('error').innerHTML = '<div>Please enter valid PRICE !</div>';
        return;
    }
    else if ((entry > sl && entry > tp) || (entry < sl && entry < tp)) {
        document.getElementById("calculatorResult").style.display = "none";
        document.getElementById("calculatorError").style.display = "block";
        document.getElementById('error').innerHTML = '<div>Take Profit and Stop Loss must be on opposite sides of Entry Price !</div>';
        return;
    }
    else{
      document.getElementById("calculatorResult").style.display = "block";
      document.getElementById("calculatorError").style.display = "none";
    }


    const positionSize = Math.abs(risk / (entry - sl));
    const potentialProfit = positionSize * Math.abs(tp - entry);
    const rr = Math.abs(tp - entry) / Math.abs(entry - sl);
    const pnl = potentialProfit;
    const limitFeePercent = 0.02 / 100; // 0.02% fee
    const marketFeePercent = 0.045 / 100; // 0.045% fee
    const marketWinFee = (entry + tp) * positionSize * marketFeePercent;
    const marketLoseFee = (entry + sl) * positionSize * marketFeePercent;
    const limitWinFee = (entry + tp) * positionSize * limitFeePercent;
    const limitLoseFee = (entry + sl) * positionSize * limitFeePercent;
    const marketLosePnL = -Math.abs(risk) - marketLoseFee;
    const limitLosePnL = -Math.abs(risk) - limitLoseFee;
    const marketWinPnL = pnl - marketWinFee;
    const limitWinPnL = pnl - limitWinFee;

    document.getElementById('result').innerHTML = `
        <div class="label">Position Size (units)</div>
        <div class="value position">${positionSize.toFixed(6)} </div>
        <div class="label">Profit Target ($)</div>
        <div class="value pnl">$ ${pnl.toFixed(2)}</div>
        <div class="label">Risk-Reward (RR)</div>
        <div class="value rr">${rr.toFixed(2)}</div>
        <div class="label"><hr/></div>
        <div class="value position"><hr/></div>
        <div class="label fee">Market Order Win Fee ($)</div>
        <div class="value fee">$ ${marketWinFee.toFixed(2)} → PnL = $ ${marketWinPnL.toFixed(2)}</div>
        <div class="label fee">Market Order Lose Fee ($)</div>
        <div class="value fee">$ ${marketLoseFee.toFixed(2)} → PnL = $ ${marketLosePnL.toFixed(2)}</div>
        <div class="label fee">Limit Order Win Fee ($)</div>
        <div class="value fee">$ ${limitWinFee.toFixed(2)} → PnL = $ ${limitWinPnL.toFixed(2)}</div>
        <div class="label fee">Limit Order Lose Fee ($)</div>
        <div class="value fee">$ ${limitLoseFee.toFixed(2)} → PnL = $ ${limitLosePnL.toFixed(2)}</div>
    `;
}
document.getElementById('calculateBtn').addEventListener('click', calculatePosition);
const inputs = ['entry','sl','tp','risk'];
inputs.forEach((id, index) => {
    document.getElementById(id).addEventListener('keydown', function(e){
        if(e.key === "Enter") {
            e.preventDefault();
            if(index < inputs.length - 1) {
                document.getElementById(inputs[index + 1]).focus();
            } else {
                calculatePosition();
            }
        }
    });
});
