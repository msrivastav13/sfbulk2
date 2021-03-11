/* eslint-disable header/header */
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import BulkAPI2 from 'node-sf-bulk2/dist/bulk2';
import { BulkAPI2Connection, BulkJobInfoResponse } from 'node-sf-bulk2';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
// TODO: replace the package name with your new package's name
const messages = Messages.loadMessages('sfbulk2api', 'org');

export default class Org extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx data:bulk2:query --query "Select Id, Name From Account" --targetusername
  `,
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    jobid: flags.string({
      char: 'i',
      description: messages.getMessage('nameFlagDescription'),
      required: true,
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<BulkJobInfoResponse> {
    const conn = this.org.getConnection();
    const bulkconnect: BulkAPI2Connection = {
      accessToken: conn.accessToken,
      apiVersion: conn.getApiVersion(),
      instanceUrl: conn.instanceUrl,
    };
    try {
      const response: BulkJobInfoResponse = await new BulkAPI2(bulkconnect).getBulkQueryJobInfo(this.flags.jobid);
      this.ux.logJson(response);
      return response;
    } catch (ex) {
      this.ux.log(JSON.stringify(ex));
    }
  }
}
