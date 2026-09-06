// Inline SVG flags. Emoji flags are unreliable: Windows renders none of them
// (you get the bare "TW"/"HK" letter pair), and some platforms hide specific
// regional flags depending on the device's region setting. Drawing them keeps
// the switcher identical everywhere.
// Simplified but recognizable, 3:2 ratio.

const S = { display: "inline-block", borderRadius: 2, flex: "none", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)" };

export default function Flag({ iso, size = 20 }) {
  const w = size, h = Math.round((size * 2) / 3);
  const p = { width: w, height: h, viewBox: "0 0 24 16", style: S, "aria-hidden": true, xmlns: "http://www.w3.org/2000/svg" };

  switch (iso) {
    case "US":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12, 14].map((y) => <rect key={y} y={y} width="24" height="1.23" fill="#B22234" />)}
        <rect width="10" height="8.6" fill="#3C3B6E" />
      </svg>);
    case "GB":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.2" />
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.8" />
        <path d="M12 0 V16 M0 8 H24" stroke="#fff" strokeWidth="5.4" />
        <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3.2" />
      </svg>);
    case "SG":
      return (<svg {...p}>
        <rect width="24" height="8" fill="#ED2939" />
        <rect y="8" width="24" height="8" fill="#fff" />
        <circle cx="6" cy="4" r="2.9" fill="#fff" />
        <circle cx="7.5" cy="4" r="2.6" fill="#ED2939" />
        <g fill="#fff">{[[9.2, 2.2], [10.7, 3.4], [10.1, 5.2], [8.3, 5.2], [7.7, 3.4]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r=".62" />)}</g>
      </svg>);
    case "AU":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#00247D" />
        <g transform="scale(.5)"><rect width="24" height="16" fill="#00247D" />
          <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3" />
          <path d="M12 0 V16 M0 8 H24" stroke="#fff" strokeWidth="5" />
          <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3" />
        </g>
        <g fill="#fff"><circle cx="6" cy="13" r="1.1" /><circle cx="17" cy="4" r=".8" /><circle cx="19.5" cy="7.5" r=".8" /><circle cx="17" cy="11" r=".8" /><circle cx="14.6" cy="7.5" r=".7" /><circle cx="20.6" cy="12.6" r=".55" /></g>
      </svg>);
    case "CA":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#fff" />
        <rect width="6" height="16" fill="#D80621" /><rect x="18" width="6" height="16" fill="#D80621" />
        <path d="M12 3.4 l1 2.2 2-.8-.7 2.2 2 .5-1.7 1.4.5 1.1-2.1-.4.2 2.6h-.4l.2-2.6-2.1.4.5-1.1L9.7 7.5l2-.5L11 4.8l2 .8z" fill="#D80621" />
      </svg>);
    case "ES":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#AA151B" />
        <rect y="4" width="24" height="8" fill="#F1BF00" />
      </svg>);
    case "MX":
      return (<svg {...p}>
        <rect width="8" height="16" fill="#006847" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#CE1126" />
        <circle cx="12" cy="8" r="1.9" fill="none" stroke="#8C6239" strokeWidth="1" />
      </svg>);
    case "PE":
      return (<svg {...p}>
        <rect width="8" height="16" fill="#D91023" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#D91023" />
      </svg>);
    case "DO":
      // Quadrants split by the white cross: blue top-hoist/bottom-fly, red
      // top-fly/bottom-hoist. (Coat of arms omitted — same simplification as
      // the other flags here, e.g. MX's eagle.)
      return (<svg {...p}>
        <rect width="10.6" height="6.6" fill="#002D62" />
        <rect x="13.4" width="10.6" height="6.6" fill="#CE1126" />
        <rect y="9.4" width="10.6" height="6.6" fill="#CE1126" />
        <rect x="13.4" y="9.4" width="10.6" height="6.6" fill="#002D62" />
        <rect x="10.6" width="2.8" height="16" fill="#fff" />
        <rect y="6.6" width="24" height="2.8" fill="#fff" />
      </svg>);
    case "BR":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#009C3B" />
        <path d="M12 2 L22 8 L12 14 L2 8 Z" fill="#FFDF00" />
        <circle cx="12" cy="8" r="3.4" fill="#002776" />
        <path d="M8.8 7.1 A4.6 4.6 0 0 1 15.3 6.6" stroke="#fff" strokeWidth=".9" fill="none" />
      </svg>);
    case "PT":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#DA291C" />
        <rect width="9.6" height="16" fill="#046A38" />
        <circle cx="9.6" cy="8" r="3.1" fill="#FFE900" />
        <circle cx="9.6" cy="8" r="2.1" fill="#fff" />
        <circle cx="9.6" cy="8" r="1.3" fill="#DA291C" />
      </svg>);
    case "FR":
      return (<svg {...p}>
        <rect width="8" height="16" fill="#002395" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#ED2939" />
      </svg>);
    case "IT":
      return (<svg {...p}>
        <rect width="8" height="16" fill="#008C45" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#CD212A" />
      </svg>);
    case "DE":
      return (<svg {...p}>
        <rect width="24" height="5.34" fill="#000" />
        <rect y="5.34" width="24" height="5.33" fill="#DD0000" />
        <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
      </svg>);
    case "HK":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#DE2910" />
        <g fill="#fff" transform="translate(12 8)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} rx="1.05" ry="2.7" cy="-2.5" transform={`rotate(${a})`} />
          ))}
        </g>
      </svg>);
    case "TW":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#FE0000" />
        <rect width="12" height="8" fill="#000095" />
        <g transform="translate(6 4)">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="-0.42" y="-3.1" width="0.84" height="1.75" fill="#fff" transform={`rotate(${i * 30})`} />
          ))}
          <circle r="1.75" fill="#fff" />
          <circle r="1.45" fill="#000095" />
          <circle r="1.1" fill="#fff" />
        </g>
      </svg>);
    case "RU":
      return (<svg {...p}>
        <rect width="24" height="5.34" fill="#fff" />
        <rect y="5.34" width="24" height="5.33" fill="#0039A6" />
        <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
      </svg>);
    case "AE":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#fff" />
        <rect width="24" height="5.34" fill="#00732F" />
        <rect y="10.66" width="24" height="5.34" fill="#000" />
        <rect width="7" height="16" fill="#FF0000" />
      </svg>);
    case "BD":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#006A4E" />
        <circle cx="10.5" cy="8" r="4.6" fill="#F42A41" />
      </svg>);
    case "IL":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#fff" />
        <rect x="0" y="2.2" width="24" height="1.7" fill="#0038B8" />
        <rect x="0" y="12.1" width="24" height="1.7" fill="#0038B8" />
        {/* Star of David: two overlapping outlined triangles. */}
        <g fill="none" stroke="#0038B8" strokeWidth="0.62">
          <polygon points="12,5.3 14.4,9.5 9.6,9.5" />
          <polygon points="12,10.7 14.4,6.5 9.6,6.5" />
        </g>
      </svg>);
    case "SE":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#005293" />
        {/* Nordic cross: vertical bar sits left of centre. */}
        <rect x="7" y="0" width="3" height="16" fill="#FECB00" />
        <rect x="0" y="6.5" width="24" height="3" fill="#FECB00" />
      </svg>);
    case "JP":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#fff" />
        <circle cx="12" cy="8" r="4.4" fill="#BC002D" />
      </svg>);
    case "KR":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#fff" />
        {/* Taegeuk: red top-left lobe, blue bottom-right lobe via an S-curve. */}
        <circle cx="12" cy="8" r="3.4" fill="#CD2E3A" />
        <path d="M12 4.6 A1.7 1.7 0 0 1 12 8 A1.7 1.7 0 0 0 12 11.4 A3.4 3.4 0 0 0 12 4.6 Z" fill="#0047A0" />
        <g stroke="#000" strokeWidth="0.5">
          {/* four corner trigram hints */}
          <line x1="4.4" y1="3.2" x2="6.6" y2="5" /><line x1="17.4" y1="11" x2="19.6" y2="12.8" />
          <line x1="4.4" y1="12.8" x2="6.6" y2="11" /><line x1="17.4" y1="5" x2="19.6" y2="3.2" />
        </g>
      </svg>);
    case "NL":
      return (<svg {...p}>
        <rect width="24" height="5.34" fill="#AE1C28" />
        <rect y="5.34" width="24" height="5.33" fill="#fff" />
        <rect y="10.67" width="24" height="5.33" fill="#21468B" />
      </svg>);
    case "ID":
      return (<svg {...p}>
        <rect width="24" height="8" fill="#FF0000" />
        <rect y="8" width="24" height="8" fill="#fff" />
      </svg>);
    case "IN":
      return (<svg {...p}>
        <rect width="24" height="5.34" fill="#FF9933" />
        <rect y="5.34" width="24" height="5.33" fill="#fff" />
        <rect y="10.67" width="24" height="5.33" fill="#138808" />
        <circle cx="12" cy="8" r="2.1" fill="none" stroke="#000080" strokeWidth="0.5" />
        <circle cx="12" cy="8" r="0.35" fill="#000080" />
        <g stroke="#000080" strokeWidth="0.22">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            return <line key={i} x1={12} y1={8} x2={12 + 2.1 * Math.cos(a)} y2={8 + 2.1 * Math.sin(a)} />;
          })}
        </g>
      </svg>);
    case "VN":
      return (<svg {...p}>
        <rect width="24" height="16" fill="#DA251D" />
        <g fill="#FFFF00" transform="translate(12 8)">
          <polygon points="0,-4.2 0.94,-1.3 3.99,-1.3 1.53,0.5 2.47,3.4 0,1.6 -2.47,3.4 -1.53,0.5 -3.99,-1.3 -0.94,-1.3" />
        </g>
      </svg>);
    default:
      return (<svg {...p}><rect width="24" height="16" fill="#D8D8D0" /></svg>);
  }
}
