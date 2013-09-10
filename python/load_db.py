
import psycopg2


def denormalizeInput(inputFilename, tempFile):
		inputFile = open(inputFilename)
		out = open(tempFile,'w')

		i = 0
		labels = []
		rows = []
		num_tests = 0

		for line in inputFile:
			record = line.strip().split('\t')
			if i == 0:
				labels = record
				num_tests = len(labels)
				i += 1
				continue
			chrom = record[0][3:]
			start = record[1]
			stop = "" if start == record[2] else record[2]
			for j in range(3, num_tests):
				score = record[j].strip()
				try: 
					val = float(score)
					out.write('\t'.join([chrom, start, labels[j], score]) + '\n')
				except ValueError:
					continue

		inputFile.close()
		out.close()
		return rows


def connectToDatabase(host, port,  database, user, password):
	return psycopg2.connect(host=host, port=port, database=database, user=user, password=password)

def loadDatabase(loadFile,tableName, conn):
	load = open(loadFile,'r')
	cur = conn.cursor()
	cur.copy_from(load, tableName, sep='\t', columns=('chr','start','test','score'))
	cur.execute('CREATE TABLE IF NOT EXISTS summary_%s (id SERIAL, label VARCHAR(60),' +
		' chr VARCHAR(3), start integer, stop integer, test VARCHAR(60), test_type VARCHAR(30),' +
		' test_model VARCHAR(10), target VARCHAR(50), target_label VARCHAR(50), sample VARCHAR(10),' +
		' score double precision, info JSON);',tableName)
	cur.execute('INSERT INTO summary_%s (label, chr, start, test, test_type, test_model,' +
		' target, target_label, sample, score) SELECT label, chr, start, test,' +
		' split_part(split_part(test, '|', 1),':',1), split_part(split_part(test, '|', 1),':',2),' +
		' split_part(test, '|', 2), split_part(split_part(test,'|',2),':',3), split_part(test,'|',3),' +
		' score from variant_tests_090913')
	cur.execute('create index on variant_tests_summary_090913 (score asc)')
	cur.execute('create index on variant_tests_summary_090913 (target_label)')
	cur.execute('create index on variant_tests_summary_090913 (test_type)')
	cur.execute('create index on variant_tests_summary_090913 (test_type, test_model)')
	conn.commit()
	cur.close()

def parse_parameters():
    import argparse
    parser = argparse.ArgumentParser(description = 'Load Variant test to db')
    parser.add_argument('--input', nargs = '?' , required=True,
                            help = 'input variant test file')
    parser.add_argument('--host', nargs = '?' , required=True,
                            help = 'database host')
    parser.add_argument('--db', nargs = '?' , required=True,
                            help = 'database name')
    parser.add_argument('--user', nargs = '?' , required=True,
                            help = 'database username')
    parser.add_argument('--password', nargs = '?', required=True,
                            help = 'database password')
    parser.add_argument('--port', nargs = '?', default=5433,
                            help = 'database port')
    parser.add_argument('--table', nargs = '?', required=True, help = 'database table name')
    return parser.parse_args()

def main():
	tempFile = '.tmp_db'
	args = parse_parameters()
	conn = connectToDatabase(args.host, args.port, args.db, args.user, args.password)
	denormalizeInput(args.input, tempFile)
	loadDatabase(tempFile, args.table, conn)
	conn.close()

if __name__ == '__main__':
    main()