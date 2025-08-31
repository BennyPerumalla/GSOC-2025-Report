import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GitMerge,
  Layers3,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import { Button } from "../components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { CodeSnippet } from "../components/CodeSnippet";
import { VLCLogo } from "../components/VLCLogo";
import styles from "./_index.module.css";

const spatializerCode = `
// A New Preset Callback Implementation in spatializer.cpp
static int PresetCallback( vlc_object_t *p_aout, char const *, vlc_value_t, vlc_value_t newval, void *p_data )
{
    filter_sys_t *p_sys = (filter_sys_t*)p_data;
    const char *psz_preset = newval.psz_string;

    if (!psz_preset || strcmp(psz_preset, "custom") == 0)
        return VLC_SUCCESS;

    int preset_idx = -1;
    for (size_t i = 0; i < g_spatializerPresets.size(); ++i)
    {
        if (strcmp(psz_preset, g_spatializerPresets[i].name) == 0)
        {
            preset_idx = i;
            break;
        }
    }

    if (preset_idx < 0)
        return VLC_EGENERIC;

    const auto& preset = g_spatializerPresets[preset_idx];
    msg_Dbg( p_aout, "Applying preset: %s", preset.name );

    for (const auto& cb : callbacks)
        var_DelCallback(p_aout, cb.psz_name, cb.fp_callback, p_sys);

    {
        vlc_mutex_locker locker( &p_sys->lock );
        p_sys->p_reverbm->setroomsize(preset.roomSize);
        p_sys->p_reverbm->setwidth(preset.width);
        p_sys->p_reverbm->setwet(preset.wet);
        p_sys->p_reverbm->setdry(preset.dry);
        p_sys->p_reverbm->setdamp(preset.damp);
    }

    var_SetFloat(p_aout, "spatializer-roomsize", preset.roomSize);
    var_SetFloat(p_aout, "spatializer-width",    preset.width);
    var_SetFloat(p_aout, "spatializer-wet",      preset.wet);
    var_SetFloat(p_aout, "spatializer-dry",      preset.dry);
    var_SetFloat(p_aout, "spatializer-damp",     preset.damp);

    for (const auto& cb : callbacks)
        var_AddCallback(p_aout, cb.psz_name, cb.fp_callback, p_sys);

    return VLC_SUCCESS;
}
`;

const DynaudnormCode = `
static block_t *DoWork(filter_t *p_filter, block_t *p_in_buf)
{
    filter_sys_t *p_sys = p_filter->p_sys;
    block_t *p_out_buf = NULL;
    int i_ret;

    /* Prepare input frame */
    AVFrame *p_in_frame = p_sys->p_frame;
    p_in_frame->sample_rate = p_filter->fmt_in.audio.i_rate;
    p_in_frame->nb_samples = p_in_buf->i_nb_samples;
    p_in_frame->format = AV_SAMPLE_FMT_FLT;

    vlc_to_av_channel_layout(&p_in_frame->ch_layout, &p_filter->fmt_in.audio);

    p_in_frame->data[0] = p_in_buf->p_buffer;
    /* CAUTION: For planar float FL32, there is only one data plane. Setting
     * linesize to 0 tells FFmpeg the buffer is contiguous, but setting it to
     * the actual buffer size might be more robust. */
    p_in_frame->linesize[0] = 0;
    p_in_frame->pts = p_in_buf->i_pts;

    i_ret = av_buffersrc_add_frame_flags(p_sys->p_src_ctx, p_in_frame, AV_BUFFERSRC_FLAG_KEEP_REF);
    if (i_ret < 0)
    {
        msg_Warn(p_filter, "Error submitting frame to the filter graph");
        block_Release(p_in_buf);
        av_channel_layout_uninit(&p_in_frame->ch_layout);
        return NULL;
    }

    while (true)
    {
        AVFrame *p_filtered_frame = av_frame_alloc();
        if (!p_filtered_frame)
        {
            msg_Err(p_filter, "Could not allocate filtered frame");
            break;
        }

        i_ret = av_buffersink_get_frame(p_sys->p_sink_ctx, p_filtered_frame);
        if (i_ret == AVERROR(EAGAIN) || i_ret == AVERROR_EOF)
        {
            av_frame_free(&p_filtered_frame);
            break;
        }
        else if (i_ret < 0)
        {
            msg_Warn(p_filter, "Error receiving frame from the filter graph");
            av_frame_free(&p_filtered_frame);
            break;
        }

        const int i_size = p_filtered_frame->nb_samples * p_filter->fmt_out.audio.i_bytes_per_frame;
        p_out_buf = block_Alloc(i_size);
        if (p_out_buf)
        {
            p_out_buf->i_nb_samples = p_filtered_frame->nb_samples;
            p_out_buf->i_dts = p_filtered_frame->pts;
            p_out_buf->i_pts = p_filtered_frame->pts;
            p_out_buf->i_length = vlc_tick_from_samples(p_out_buf->i_nb_samples,
                                                        p_filter->fmt_out.audio.i_rate);
            memcpy(p_out_buf->p_buffer, p_filtered_frame->data[0], i_size);
        }
        av_frame_free(&p_filtered_frame);
    }

    block_Release(p_in_buf);
    av_channel_layout_uninit(&p_in_frame->ch_layout);
    return p_out_buf;
}
`;

const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title>GSOC Report 2025 - Benny Perumalla</title>
        <meta
          name="description"
          content="GSOC 2025 project report by Benny Perumalla documenting advanced audio filters and DSP development for VLC Media Player, including spatializer's configurable presets, Dynaudnorm, and filtering implementations."
        />
      </Helmet>
      <div className={styles.pageContainer}>
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.heroHeader}>
                <VLCLogo size="lg" className={styles.vlcLogo} />
                <h1 className={styles.heroTitle}>
                  GSOC 2025: Advanced Audio Processing for VLC
                </h1>
              </div>
              <p className={styles.heroSubtitle}>
                A comprehensive Google Summer of Code 2025 project focused on 
                developing advanced audio processing capabilities for VLC Media Player, 
                featuring spatializer's configurable presets, Dynaudnorm, and high-performance filtering.
              </p>
              <div className={styles.attribution}>
                <p>By <strong>Benny Perumalla</strong></p>
              </div>
              <div className={styles.heroActions}>
                <Button asChild size="lg">
                  <Link to="/documentation">
                    View Documentation <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://code.videolan.org/BY01R/vlc-gsoc-audio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore Code <GitMerge size={20} />
                  </a>
                </Button>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <Waves className={styles.heroIcon} />
            </div>
          </section>

          <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>Core Contributions</h2>
            <p className={styles.sectionDescription}>
              Explore the key features developed to improve the audio experience
              in VLC.
            </p>
            <Tabs defaultValue="spatializer" className={styles.tabs}>
              <TabsList>
                <TabsTrigger value="spatializer">
                  <Layers3 size={16} /> Spatializer
                </TabsTrigger>
                <TabsTrigger value="Dynaudnorm">
                  <SlidersHorizontal size={16} /> Dynaudnorm
                </TabsTrigger>
                <TabsTrigger value="contributions">
                  <GitMerge size={16} /> Contributions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="spatializer" className={styles.tabContent}>
                <div className={styles.featureGrid}>
                  <div className={styles.featureText}>
                    <h3>Spatializer: configurable presets</h3>
                    <p>
                    The new preset system has been implemented that adds a dropdown menu to the filter's configuration panel. Users can now select from environments like "Auditorium," "Great Hall," or "Small Room." Selecting a preset automatically configures the underlying parameters.
                    </p>
                    <ul>
                      <li>New Presets Library (`spatializer_presets.h`)</li>
                      <li>UI and Logic Integration (`spatializer.cpp`)</li>
                      <li>Callback and State Management</li>
                    </ul>
                  </div>
                  <div className={styles.featureVisual}>
                    <div className={styles.codeSnippetFixed}>
                    <CodeSnippet code={spatializerCode} language="c" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Dynaudnorm" className={styles.tabContent}>
                <div className={styles.featureGrid}>
                  <div className={styles.featureText}>
                    <h3>FFmpeg Dynaudnorm Audio Filter</h3>
                    <p>
                    The filter is designed to solve the common problem of inconsistent audio volume, providing a much smoother and more enjoyable listening experience without requiring constant manual volume adjustments.
                    </p>
                    <div className={styles.reverbParams}>
                      <h4>Key Parameters:</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td>framelen</td>
                            <td>0.1 - 1.0</td>
                          </tr>
                          <tr>
                            <td>gausssize</td>
                            <td>0.0 - 1.0</td>
                          </tr>
                          <tr>
                            <td>peak</td>
                            <td>0.0 - 1.0</td>
                          </tr>
                          <tr>
                            <td>max-gain</td>
                            <td>0.0 - 1.0</td>
                          </tr>
                          <tr>
                            <td>target-rms</td>
                            <td>0.0 - 1.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                 <div className={styles.featureVisual}>
                  <div className={styles.codeSnippetFixed}>
                    <CodeSnippet code={DynaudnormCode} language="c" />
                  </div>
                 </div>
                </div>
              </TabsContent>
              <TabsContent value="contributions" className={styles.tabContent}>
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
                      Introduced the core spatializer module with stereo width
                      controls. Merged in VLC 4.0.
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
                    enhances the usability of the spatializer filter, making a powerful audio effect more accessible to all VLC users.
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
                      Standardized audio buffer management across multiple
                      filters to reduce memory overhead and complexity.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
          </div>
        </footer>
      </div>
    </>
  );
};

export default IndexPage;