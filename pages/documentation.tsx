import React from "react";
import { Helmet } from "react-helmet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/Accordion";
import { CodeSnippet } from "../components/CodeSnippet";
import { Button } from "../components/Button";
import { MultiPDFViewer } from "../components/MultiPDFViewer";
import { VLCLogo } from "../components/VLCLogo";
import { Download, GitMerge, Linkedin } from "lucide-react";
import styles from "./documentation.module.css";

const installCode = `
# Clone the VLC repository
git clone https://code.videolan.org/videolan/vlc.git
cd vlc

# Follow the official build instructions for your OS
# On Debian/Ubuntu:
./bootstrap
./configure
make
sudo make install
`;

const apiCode = `
// Accessing the spatializer filter
vlc_object_t *p_filter = vlc_object_create(p_instance, sizeof(*p_filter), "spatializer");

// Set parameters
config_PutFloat(p_filter, "spatializer-width", 1.5f);

// ... add filter to chain
`;



const DocumentationPage = () => {
  return (
    <>
      <Helmet>
        <title>Documentation - Benny Perumalla</title>
        <meta
          name="description"
          content="Technical documentation and reports by Benny Perumalla for the GSOC 2025 VLC audio processing project, including implementation details and contribution summaries."
        />
      </Helmet>
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <VLCLogo size="md" className={styles.vlcLogo} />
            <div className={styles.headerText}>
            <h1 className={styles.title}>Project Documentation</h1>
            <p className={styles.subtitle}>
              Comprehensive project reports, technical documentation, and contribution 
              summaries for the VLC audio processing enhancement project by Benny Perumalla.
            </p>
              <div className={styles.attribution}>
                <p>By <strong>Benny Perumalla</strong></p>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.documentationSection}>
            <h2 className={styles.sectionTitle}>Project Documentation</h2>
            <MultiPDFViewer 
              defaultDocument="gsoc-2025-final-report"
              className={styles.multiPdfViewerContainer} 
            />
          </section>

          <section className={styles.technicalSection}>
            <h2 className={styles.sectionTitle}>Technical Details</h2>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Installation & Build Process</AccordionTrigger>
                <AccordionContent>
                  <p>
                    The audio filters are part of the main VLC source tree. To
                    use them, you need to compile VLC from source. Ensure you
                    have the required build dependencies for your operating
                    system.
                  </p>
                  <CodeSnippet code={installCode} language="bash" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>API Usage</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Filters can be instantiated and configured programmatically
                    using the VLC core API. This is useful for developers
                    looking to integrate these filters into their own
                    VLC-based applications.
                  </p>
                  <CodeSnippet code={apiCode} language="c" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Spatializer Algorithm</AccordionTrigger>
                <AccordionContent>
                  The spatializer uses a combination of panning laws and phase
                  shifting to create the perception of a wider stereo image. The
                  core of the algorithm is a simplified matrix transformation
                  applied to the stereo audio samples, which can be adjusted in
                  real-time via the 'width' parameter.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Dynaudnorm Algorithm</AccordionTrigger>
                <AccordionContent>
                  <p>
                    This filter applies a certain amount of gain to the input audio in order to bring its
                    peak magnitude to a target level (e.g. 0 dBFS). However, in contrast to more "simple"
                    normalization algorithms, the Dynamic Audio Normalizer dynamically re-adjusts the gain
                    factor to the input audio.
                  </p>
                  <p>
                    This allows for applying extra gain to the "quiet" sections of the audio while avoiding
                    distortions or clipping the "loud" sections. In other words: The Dynamic Audio Normalizer will
                    "even out" the volume of quiet and loud sections, in the sense that the volume of each
                    section is brought to the same target level.
                  </p>
                  <p>
                    Note, however, that the Dynamic Audio Normalizer achieves this goal without applying
                    "dynamic range compressing". It will retain 100% of the dynamic range within each section of
                    the audio file.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Reverb Implementation</AccordionTrigger>
                <AccordionContent>
                  Our reverb engine is based on the Schroeder reverberator
                  model, which combines multiple comb filters in parallel and
                  all-pass filters in series. This provides a computationally
                  efficient way to simulate the complex reflections of a room.
                  Performance is further enhanced by using FFT-based convolution
                  for longer reverb tails.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className={styles.contributionsList}>
              <h3>Merge Requests & Code Contributions</h3>
              <p>
                Our work is contributed directly to the VLC project. Below
                is a summary of our key merge requests.
              </p>
              <div className={styles.contributionItem}>
                <h4>
                  <a
                    href="https://code.videolan.org/BY01R/vlc-gsoc-audio/-/merge_requests/6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    feat(audio): Add new spatiafeat(audio): Add FFmpeg Dynaudnorm Audio Filterlizer audio filter
                  </a>
                </h4>
                <p>
                  The dynaudnorm filter addresses this by dynamically compressing the audio's dynamic range
                  to maintain a consistent volume level, enhancing the overall listening experience.
                </p>
              </div>
              <div className={styles.contributionItem}>
                <h4>
                  <a
                    href="https://code.videolan.org/BY01R/vlc-gsoc-audio/-/merge_requests/5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Spatializer: configurable presets for the reverb settings
                  </a>
                </h4>
                <p>
                  A user-friendly preset system to the Audio Spatializer filter, improving usability by allowing users to quickly select from a range of pre-configured reverb environments.
                </p>
              </div>
              <div className={styles.contributionItem}>
                <h4>
                  <a
                    href="https://code.videolan.org/BY01R/vlc-gsoc-audio/-/merge_requests/1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    feat: Implement multiband compressor functionality
                  </a>
                </h4>
                <p>
                  The integration of a multiband compressor into the existing compressor functionality within VLC. This enhancement significantly improves audio processing capabilities by allowing independent compression across different frequency bands.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBranding}>
              <VLCLogo size="sm" />
              <span>GSOC Report 2025 - VLC Audio Processing</span>
            </div>
            <div className={styles.footerAttribution}>
              <p>Created by <strong>Benny Perumalla</strong></p>
              <p>© 2025 - Contributing to VLC Media Player</p>
            </div>

            <div className={styles.mentorThanks}>
              <p className={styles.mentorHeading}>With gratitude to my mentors</p>
              <div className={styles.mentorList}>
                <a
                  className={styles.mentorLink}
                  href="http://linkedin.com/in/thomasguillem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Thomas Guillem on LinkedIn"
                >
                  <Linkedin size={16} />
                  <span>Thomas Guillem</span>
                </a>
                <a
                  className={styles.mentorLink}
                  href="https://www.linkedin.com/in/fcartegnie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Francois Cartegnie on LinkedIn"
                >
                  <Linkedin size={16} />
                  <span>Francois Cartegnie</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DocumentationPage;