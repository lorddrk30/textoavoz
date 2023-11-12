import express from 'express';
import bodyParser from 'body-parser';
import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs';

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); 

app.post('/synthesize', async (req, res) => {
    try {
        const text = req.body.text;
        const EMBED = "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin";

        const synthesizer = await pipeline(
            'text-to-speech',
            'Xenova/speecht5_tts',
            { quantized: false }
        );

        const output = await synthesizer(text, { speaker_embeddings: EMBED });

        const wav = new wavefile.WaveFile();
        wav.fromScratch(1, output.sampling_rate, '32f', output.audio);
        
        const filename = `output_${Date.now()}.wav`;
        const filepath = `./public/${filename}`;
         console
        fs.writeFileSync(filepath, wav.toBuffer());

        res.set('Content-Type', 'audio/wav');
        res.json({ audioUrl: `/${filename}` });
    } catch (error) {
        console.error('Error en la síntesis de voz:', error);
        res.status(500).send('Error en el servidor');
    }
});

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
