/* eslint-disable header/header */
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import BulkAPI2 from 'node-sf-bulk2/dist/bulk2';
import { BulkAPI2Connection, BulkQueryResponse, QueryInput } from 'node-sf-bulk2';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
// TODO: replace the package name with your new package's name
const messages = Messages.loadMessages('sfbulk2api', 'org');

export default class BulkQuery extends SfdxCommand {
  public static description = messages.getMessage('bulkCommandDescription');

  public static examples = [
    `$ sfdx bulk2:query --query "Select Id, Name From Account" --targetusername myOrg@example.com
  `,
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    query: flags.string({
      char: 'q',
      description: messages.getMessage('queryFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<BulkQueryResponse> {
    const query = this.flags.query as string;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    const bulkconnect: BulkAPI2Connection = {
      accessToken: conn.accessToken,
      apiVersion: '51.0',
      instanceUrl: conn.instanceUrl,
    };
    try {
      const bulkapi2 = new BulkAPI2(bulkconnect);
      const queryInput: QueryInput = {
        query,
        operation: 'query',
      };
      const response = await bulkapi2.submitBulkQueryJob(queryInput);
      this.ux.logJson(response);
      return response;
    } catch (ex) {
      this.ux.error(ex);
    }
  }
}
