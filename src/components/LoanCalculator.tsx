async startAnalysis() {

  try {

    const { data: session } = await supabase
      .from('user_sessions')
      .insert({
        funnel_type: this.funnelType(),
        amount: this.inputValue(),
        months: this.monthsValue(),
        income_type: this.incomeType()
      })
      .select()
      .single();

    const userId = session.id;

    const res = await fetch(
      "https://ghqzubppsfxhwfgcgroa.supabase.co/functions/v1/get-offer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      }
    );

    const offer = await res.json();

    await supabase.from("offer_views").insert({
      offer_id: offer.id
    });

    window.location.href = offer.url;

  } catch (err) {
    console.error(err);
  }
}
