export default async function handler(req, res){
  if(req.method!=='POST'){ res.status(405).json({error:'Method not allowed'}); return; }
  try{
    const body = req.body || {};
    const apiKey = req.headers['x-openai-key'] || process.env.OPENAI_API_KEY;
    if(!apiKey){ res.status(400).json({error:'Missing API key'}); return; }
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body: JSON.stringify({ model: body.model || 'gpt-5', messages: body.messages||[], temperature: body.temperature??0.7 })
    });
    const text = await r.text();
    if(!r.ok){ res.status(r.status).send(text || r.statusText); return; }
    const data = JSON.parse(text);
    const content = data?.choices?.[0]?.message?.content || '';
    res.status(200).json({ text: content, raw: data });
  }catch(e){ res.status(500).json({error:e.message}); }
}