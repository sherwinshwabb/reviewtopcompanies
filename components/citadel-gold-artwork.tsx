import Image from "next/image";
import styles from "./citadel-gold.module.css";

export function CitadelGoldArtwork() {
  return (
    <div className={styles.artwork}>
      <div className={styles.artworkCopy}>
        <span className={styles.overline}>
          A REFINED APPROACH TO PRECIOUS METALS
        </span>
        <p>
          Something real.
          <br />
          <em>Something lasting.</em>
        </p>
      </div>
      <div className={styles.coins}>
        <Image
          className={styles.buffalo}
          src="/citadel/gold-buffalo.png"
          alt="American Gold Buffalo coin"
          width={900}
          height={900}
          sizes="(max-width: 767px) 220px, 300px"
        />
        <Image
          className={styles.eagle}
          src="/citadel/gold-eagle.png"
          alt="American Gold Eagle coin against deep green velvet"
          width={900}
          height={900}
          sizes="(max-width: 767px) 240px, 340px"
        />
      </div>
      <span className={styles.artworkFootnote}>
        PHYSICAL GOLD · SILVER · PRECIOUS METALS IRAs
      </span>
    </div>
  );
}
