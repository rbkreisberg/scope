
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

def loadDatabase(loadFile, conn):
	load = open(loadFile,'r')
	cur = conn.cursor()
	cur.copy_from(load, 'variant_tests_090913', sep='\t', columns=('chr','start','test','score'))
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
    return parser.parse_args()

def main():
	tempFile = '.tmp_db'
	args = parse_parameters()
	conn = connectToDatabase(args.host, args.port, args.db, args.user, args.password)
	# denormalizeInput(args.input, tempFile)
	loadDatabase(tempFile, conn)
	conn.close()

if __name__ == '__main__':
    main()