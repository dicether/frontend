import * as React from "react";
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

export type Props = {
    campaigns: Campaign[];
};

const Campaigns = ({campaigns}: Props) => (
    <div style={{marginTop: "2rem"}}>
        <h3>Campaigns</h3>
        <div>
            {campaigns.map((campaign, i) => (
                <Campaign key={i} campaign={campaign} />
            ))}
        </div>
    </div>
);

export default Campaigns;
