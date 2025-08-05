import * as React from "react";
import {WithTranslation, withTranslation} from "react-i18next";

import {Campaign} from "./types";
import {CHAIN_ID} from "../../../../config/config";
import {CopyToClipBoard, DefinitionEntry, Ether} from "../../../../reusable";

interface CampaignProps {
    campaign: Campaign;
}

const Campaign = ({campaign}: CampaignProps) => (
    <div>
        <h4 style={{marginTop: "1rem"}}>
            {campaign.name} ({`https://dicether.com/?ref=${campaign.id}`})
            <CopyToClipBoard
                message={"Copied! You can paste it now!"}
                content={`https://dicether.com/?ref=${campaign.id}`}
            />
        </h4>
        <dl>
            <DefinitionEntry name="Hits:" value={campaign.hits} />
            <DefinitionEntry name="Registrations:" value={campaign.referred} />
            <DefinitionEntry name="Profit:" value={<Ether gwei={campaign.balances[CHAIN_ID] || 0} />} />
            <DefinitionEntry name="Commission:" value={`${campaign.commission * 100}%`} />
        </dl>
    </div>
);

export interface Props extends WithTranslation {
    campaigns: Campaign[];
}

const Campaigns = ({campaigns, t}: Props) => (
    <div style={{marginTop: "2rem"}}>
        <h3>{t("campaigns")}</h3>
        <div>
            {campaigns.map((campaign, i) => (
                <Campaign key={i} campaign={campaign} />
            ))}
        </div>
    </div>
);

export default withTranslation()(Campaigns);
