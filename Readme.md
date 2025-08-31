# Audio Signal Processing Toolbox Website
        
Design an Audio Filters and Digital Signal Processing project report website, styled to match the technical theme of VLC Media Player and DSP. Use a sleek, modern interface with a dark background—deep black (#121212)—accented by vivid audio-inspired highlights in orange (#FF8000), neon blue (#00EFFF), and white. Incorporate VLC visual cues (traffic cone iconography), waveforms, and module grid elements.

The homepage should introduce the project’s goals: "Advancing audio filters and DSP for enhanced VLC Media playback, with features such as spatializer, reverb, and advanced filtering." Include interactive sections for each core contribution:
* Spatializer/Channel Mapping: Diagrams, code snippets
* Reverb Settings: Parameter tables and audio samples
* Merge Request/Code Contributions: Timeline or list with links and descriptions

Add access to technical documentation, embedded PDF/blog viewer for the guide, and links to merge requests. Use monospaced fonts for code and animated waveforms or spectrum visualizer as a header/footer effect. The site should feel like a tools dashboard for audio engineering and digital signal projects.

Essential Elements for the Theme
* Dark, technical look: Black backgrounds and neon accents for a DSP/audio feel
* VLC/audio motifs: Cone icon, spectral visualizations, waveform graphics
* Interactive documentation: Embedded read-only PDF/doc viewer, links to code/merge requests
* Audio samples: Integrated player for filter/reverb demos
* Responsive, accessible design: For technical audiences and general viewers

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, request a `pg_dump` from support, upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
