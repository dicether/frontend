import * as React from "react";
import {WithNamespaces, withNamespaces} from "react-i18next";

import {DefinitionEntry, Ether} from "../../../../reusable";
import {Campaign} from "./types";

type CampaignProps = {
    campaign: Campaign;
};

const Campaign = ({campaign}: CampaignProps) => (
    <div>
        <h4 style={{marginTop: "1rem"}}>
            {campaign.name} ({`https://dicether.com/?ref=${campaign.id}`})
        </h4>
        <dl>
            <DefinitionEntry name="Hits:" value={campaign.hits} />
            <DefinitionEntry name="Registrations:" value={campaign.referred} />
            <DefinitionEntry name="Profit:" value={<Ether gwei={campaign.balance} />} />
            <DefinitionEntry name="Commission:" value={`${campaign.commission * 100}%`} />
        </dl>
    </div>
);

export interface Props extends WithNamespaces {
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

export default withNamespaces()(Campaigns);
