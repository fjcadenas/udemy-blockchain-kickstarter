import React from "react";
import Link from "next/link";
import { Menu, Icon } from "semantic-ui-react";

export default () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href="/">
        <Menu.Item link={true}>CrowdCoin</Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Link href="/">
          <Menu.Item link={true}>Campaigns</Menu.Item>
        </Link>
        <Link href="/campaign/new">
          <Menu.Item link={true}>
            <Icon name="add" />
          </Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
