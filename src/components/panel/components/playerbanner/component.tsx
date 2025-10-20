import React, { JSX, useContext } from "react";
import css from "../../styles.module.css";
import classNames from "classnames";
import { PlayerContext } from "../../component";

export function PlayerBanner(): JSX.Element {
    const player = useContext(PlayerContext);
    const profile = player?.playerProfile;
    const steamIdentifier = profile?.included?.find(
        (item) =>
            item.type === "identifier" && item.attributes?.type === "steamID",
    );
    const steamProfile = steamIdentifier?.attributes?.metadata;

    // console.log("PlayerBanner: profile", steamProfile);
    return (
        <div className={classNames(css.player_banner, css.section)}>
            <div className={css.player_banner_avatar}>
                {steamProfile?.profile.avatarfull && (
                    <img
                        src={steamProfile.profile.avatarfull}
                        alt={`${steamProfile.profile.personaname}'s avatar`}
                    />
                )}
            </div>
            <div className={css.player_banner_info}>
                <div className={css.player_name}>
                    {steamProfile?.profile.personaname || "Loading..."}
                </div>
                <div className={css.player_steam_profile_url}>
                    <a
                        href={steamProfile?.profile.profileurl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {steamProfile?.profile.profileurl || "Loading..."}
                    </a>
                </div>
            </div>
            <div className={css.player_status}>
                <div></div>
            </div>
        </div>
    );
}
