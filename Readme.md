# GSoC 2025 Project: Advanced Audio Processing for VLC Media Player

This repository contains the work completed by **Benny Perumalla** for the Google Summer of Code 2025 program with VideoLAN. The project focused on integrating advanced audio processing features into VLC Media Player to improve the user listening experience.

## Features Implemented

This project delivered two core features:

1.  **Dynamic Audio Normalizer**: A new audio filter that automatically balances audio levels.
2.  **Spatializer Presets**: A user-friendly preset system for the reverb effect.

---

### 1. FFmpeg Dynaudnorm Audio Filter

**The Problem**: Ever had to turn the volume up to hear quiet dialogue in a movie, only to frantically turn it down during a loud explosion? This filter solves that.

**The Solution**: We've integrated **FFmpeg's `dynaudnorm` filter** into VLC. It intelligently boosts quiet sounds and reduces loud ones in real-time, giving you a smooth, consistent volume level without constant manual adjustments.

**Key Technical Details**:
* Implemented as a new audio filter plugin for VLC.
* Build system updated to link against FFmpeg's `libavfilter` and `libavutil`.
* Processes audio via an FFmpeg AVFilterGraph: `abuffersrc -> dynaudnorm -> abuffersink`.
* Exposes key parameters (`framelen`, `gausssize`, `peak`, etc.) for user fine-tuning.

---

### 2. Spatializer: Configurable Presets

**The Problem**: The existing Audio Spatializer (reverb) effect was powerful but required adjusting five different sliders, which can be confusing for non-technical users.

**The Solution**: We've added a simple **dropdown preset menu**. Users can now instantly select common acoustic environments like "Auditorium," "Great Hall," or "Small Room," and the sliders will configure themselves automatically. Advanced users can still adjust the sliders manually, which switches the preset to "Custom."

**Key Technical Details**:
* A new header file (`spatializer_presets.h`) defines eight reverb environments.
* The UI in `spatializer.cpp` was updated to include a dropdown menu.
* Callback logic was implemented to manage state between the preset menu and the individual sliders.
* User settings are saved and restored correctly across sessions.

## How to Test

To test these features, you will need to compile the VLC source code from the corresponding merge request.

#### Testing the Dynamic Audio Normalizer
1.  Open any media file (a movie with action scenes is a great test case).
2.  Navigate to **Tools > Effects and Filters > Audio Effects > Dynaudnorm**.
3.  Enable the filter by checking the box.
4.  Listen to the audio and notice the balanced volume between quiet and loud scenes.
5.  Adjust the exposed parameters to see how they affect the normalization.

#### Testing the Spatializer Presets
1.  Open any media file with audio.
2.  Navigate to **Tools > Effects and Filters > Audio Effects > Spatializer**.
3.  Enable the filter.
4.  Select a preset from the new **"Preset"** dropdown menu (e.g., "Great Hall").
5.  **Verify**: The sliders below should update automatically.
6.  **Listen**: The audio's reverb should change to match the environment.
7.  Manually move any slider.
8.  **Verify**: The preset dropdown should switch to **"Custom."**

## Contributors

* **Student Developer**: Benny Perumalla ([benny01r@gmail.com](mailto:benny01r@gmail.com))

## Mentors

A huge thank you to my mentors for their guidance and support:
* Thomas Guillem
* Francois Cartegnie

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
