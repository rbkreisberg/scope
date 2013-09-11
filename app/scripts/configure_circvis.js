define(['vq'], function(vq) {

	vq.data = _.isUndefined(vq.data) ? {} : vq.data;
	vq.data.genome = _.isUndefined(vq.data.genome) ? {} : vq.data.genome;

	vq.data.genome.chrom_keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
		"11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "X", "Y"
	];

	vq.data.genome.chrom_attr = {
		'1': {
			"length": 247249719
		},
		'10': {
			"length": 135374737
		},
		'11': {
			"length": 134452384
		},
		'12': {
			"length": 132349534
		},
		'13': {
			"length": 114142980
		},
		'14': {
			"length": 106368585
		},
		'15': {
			"length": 100338915
		},
		'16': {
			"length": 88827254
		},
		'17': {
			"length": 78774742
		},
		'18': {
			"length": 76117153
		},
		'19': {
			"length": 63811651
		},
		'2': {
			"length": 242951149
		},
		'20': {
			"length": 62435964
		},
		'21': {
			"length": 46944323
		},
		'22': {
			"length": 49691432
		},
		'3': {
			"length": 199501827
		},
		'4': {
			"length": 191273063
		},
		'5': {
			"length": 180857866
		},
		'6': {
			"length": 170899992
		},
		'7': {
			"length": 158821424
		},
		'8': {
			"length": 146274826
		},
		'9': {
			"length": 140273252
		},
		'M': {
			"length": 16571
		},
		'X': {
			"length": 154913754
		},
		'Y': {
			"length": 57772954
		}
	};
	var width = 900,
		height = 900,
		cnv_ring_height = 20,
		color_scale = {
			'TDT': "#7D989F",
			//blue
			'FBAT': "#8CCE62",
			//green
			'FAM_AGGR': "#9C8643",
			//orange
			'MIRN': "#A15FB1",
			//purple
			'GNAB': "#A44645",
			//red
			'PRDM': '#8c564b',
			//pink
			'RPPA': '#e377c2',
			//brown
			'CLIN': '#aa4444',
			'SAMP': '#bcbd22',
			'other': '#17becf'
		};

	function feature_type(feature) {
		return feature && feature.test_type ? feature.test_type : 'other';
	}

	function clin_type(feature) {
		return feature && feature.clin_alias && !! ~feature.clin_alias.indexOf(':') ?
			feature.clin_alias.split(':')[1] : 'other';
	}

	var shape_map = {
		'A': 'cross',
		'D': 'circle',
		'R': 'triangle-down',
		'BORDA': 'square',
		'other' : 'diamond'
	};

	function shape(feature) {
		if (feature.test_model in shape_map) return shape_map[feature.test_model];
		return shape_map['other'];
	}

	function clinical_shape(feature) {
		return shape(clin_type(feature));
	}

	var tick_colors = function(data) {
		return type_color(feature_type(data));
	};

	var type_color = function(type) {
		return color_scale[type] || color_scale['other'];
	};

	var fill_style = d3.scale.linear().domain([0, 300]).range(["#A0AEBF", "#C65568"]);

	function heatmap_scale(feature) {
		return fill_style(feature['mutation_count']);
	}

	var label_map = {
		'METH': 'DNA Methylation',
		'CNVR': 'Copy Number Variation Region',
		'MIRN': 'mircoRNA',
		'GNAB': 'Gene Abberation',
		'GEXP': 'Gene Expression',
		'CLIN': 'Clinical Data',
		'SAMP': 'Tumor Sample'
	};

	var types = Object.keys(label_map);

	var hovercard_items_config = {	
		Location: function(feature) {
			return 'Chr ' + feature.chr + ' ' + feature.start;
		},
		Target: 'target_label',
		Test: 'test_type',
		Model : 'test_model',
		'Score': 'score'
	};

	var targetMap = {
		'Preterm' : 'B:CLIN:Preterm:NB::::',
		'1n2v4' : 'B:CLIN:1n2v4:NB::::',
		'1v4' : 'B:CLIN:1v4:NB::::',
		'ETPL' : 'B:CLIN:ETPL:NB::::',
		'History_of_Preterm_Birth' : 'B:MRGE:History_of_Preterm_Birth:NB::::',
		'Placenta_Related' : 'B:MRGE:Placenta_Related:NB::::',
		'Prom_Related' :  'B:MRGE:Prom_Related:NB::::',
		'Preeclampsia/Eclampsia' :  'B:CLIN:Preeclampsia/Eclampsia:M::::',
		'Incompentent_Shortened_Cervix' :  'B:CLIN:Incompentent_Shortened_Cervix:M::::',
		'Uterine_Related' :  'B:MRGE:Uterine_Related:NB::::',
		'Strict_Infection_Related' :  'B:MRGE:Strict_Infection_Related:NB::::',
	};

	var links = [{
			label: 'Sample Summary',
			key: 'seqpeek',
			url: 'http://vis.systemsbiology.net/seqpeek/index.html',
			uri: '#sample_summary',
			href: function(feature) {
				return 'http://vis.systemsbiology.net/seqpeek/index.html#sample_summary/chr' + 
				feature.chr + '/' + feature.start + '/' + encodeURIComponent(targetMap[feature.target_label]);
			}
		}, //ucsc_genome_browser
		{
			label: 'Family Summary',
			key: 'seqpeek',
			url: 'http://vis.systemsbiology.net/seqpeek/index.html',
			uri: '#sample_summary',
			href: function(feature) {
				return 'http://vis.systemsbiology.net/seqpeek/index.html#family_summary/chr' + 
				feature.chr + '/' + feature.start + '/' + encodeURIComponent(targetMap[feature.target_label]);
			}
		}
	];

	var hovercard_links_config = {};
	var chrom_keys = vq.data.genome.chrom_keys;
	var chrom_attr = vq.data.genome.chrom_attr;
	var cytoband = vq.data.genome.cytoband;

	_.each(links, function(item) {
		hovercard_links_config[item.label] = item;
	});

	var div = document.body;

	var config = function() {
		return {
			DATATYPE: "vq.models.CircVisData",
			CONTENTS: {
				DATA: {
					features: [],
					edges: [],
					hash: function(feature) {
						return feature.chr + '_' + feature.start + '_' + feature.target_label + '_' + feature.test_type;
					}
				},
				PLOT: {
					container: div,
					width: width,
					height: height,
					vertical_padding: 10,
					horizontal_padding: 10,
					enable_pan: false,
					enable_zoom: false,
					show_legend: false
				},

				GENOME: {
					DATA: {
						key_order: chrom_keys,
						key_length: _.map(chrom_keys, function(key) {
							return {
								chr_name: key,
								chr_length: chrom_attr[key].length
							};
						})
					},
					OPTIONS: {
						radial_grid_line_width: 2,
						label_layout_style: 'clock',
						label_font_style: '16px helvetica',
						gap_degrees: 2
					}
				},

				// WEDGE: [],
				TICKS: {
					OPTIONS: {
						render_ticks: false,
						wedge_height: 15,
						wedge_width: 0.7,
						overlap_distance: 10000000, //tile ticks at specified base pair distance
						height: 30,
						fill_style: tick_colors,
						tooltip_items: hovercard_items_config,
						tooltip_links: hovercard_links_config
					}
				},
				NETWORK: {
					DATA: {
						data_array: [] //
					},
					OPTIONS: {
						render: false,
						outer_padding: 10,
						tile_nodes: Boolean(true),
						node_overlap_distance: 3e7,
						node_radius: 6,
						node_fill_style: tick_colors,
						link_stroke_style: "#CA949F",
						link_line_width: 8,
						link_alpha: 0.6,
						node_highlight_mode: 'isolate',
						node_key: function(node) {
							return node.label;
						},
						node_tooltip_items: hovercard_items_config,
						node_tooltip_links: hovercard_links_config,
						link_tooltip_items: {
							'Target': function(link) {
								var label = link.source.label.split(':');
								return '<span style="color:' + tick_colors(link.source) + '">' +
									label_map[label[1]] + '</span> ' + label[2];
							},
							'Target Location': function(link) {
								return 'Chr ' + link.source.chr + ' ' + link.source.start +
									(link.source.end ? '-' + link.source.end : '');
							},
							'Predictor': function(link) {
								var label = link.target.label.split(':');
								return '<span style="color:' + tick_colors(link.target) + '">' +
									label_map[label[1]] + '</span> ' + label[2];
							},
							'Predictor Location': function(link) {
								return 'Chr ' + link.target.chr + ' ' + link.target.start +
									(link.target.end ? '-' + link.target.end : '');
							},
							Importance: 'assoc_value1'
						}
					}
				}
			}
		};
	}

	var ring = function(test) {
		return {
			PLOT: {
				height: 100,
				type: 'glyph'
			},
			DATA: {
				value_key: test.key,
				data_array: test.data,
				},
			OPTIONS: {
				tile_height: 8,
				tile_padding: 3,
				tile_overlap_distance: 40000000,
				tile_show_all_tiles: true,
				fill_style: tick_colors,
				stroke_style: null,
				line_width: 3,
				legend_label: test.label,
				shape: shape,
				radius: 8,
				legend_description: test.label,
				listener: function() {
					return null;
				},
				outer_padding: 0,
				tooltip_items: hovercard_items_config,
				tooltip_links: hovercard_links_config
			}
		}
	};

	var config_obj = config();

	var CircvisObj = {
		reset: function() {
			config_obj = config();
		},
		config: function() {
			return config_obj;
		},
		container: function(div) {
			config_obj.CONTENTS.PLOT.container = div;
			return this;
		},
		rings: function(tests) {
			config_obj.CONTENTS.WEDGE = tests.map(ring);
			return this;
		},
		size: function(diameter) {
			config_obj.CONTENTS.PLOT.width = config_obj.CONTENTS.PLOT.height = diameter;
			return this;
		},
		data: function(data) {
			config_obj.CONTENTS.DATA.features = data;
			return this;
		},

	};

	return CircvisObj;

});