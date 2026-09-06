// "See it in action" — the three product videos, plus a VideoObject for each so
// search and AI engines can index them (video rich results, and a citable
// description of what the product does).
import JsonLd from "./JsonLd";
import VideoEmbed from "./VideoEmbed";
import { VIDEOS, watchUrl, videoSchema } from "@/lib/videos";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

export default function VideoSection({ locale = DEFAULT_LOCALE }) {
  const { vid } = mktg(locale);
  return (
    <section className="band alt" id="video">
      <div className="wrap">
        {VIDEOS.map((v) => <JsonLd key={v.id} data={videoSchema(v)} />)}
        <div className="eyebrow">{vid.eyebrow}</div>
        <h2>{vid.h2}</h2>
        <p className="lead">{vid.lead}</p>
        <div className="vid-grid">
          {VIDEOS.map((v, i) => (
            <div className="vid-card" key={v.id}>
              <VideoEmbed video={v} priority={i === 0} />
              {/* Titles stay in English: these are the actual YouTube titles of
                  English-language videos, so translating them would misname them. */}
              <h3 className="vid-title">
                <a href={watchUrl(v.id)} target="_blank" rel="noopener">{v.title}</a>
              </h3>
              <p className="vid-blurb">{v.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
